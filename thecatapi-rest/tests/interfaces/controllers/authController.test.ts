import { Request, Response } from 'express';
import AuthController from '../../../src/interfaces/rest/controllers/authController';
import LoginUser from '../../../src/application/use-cases/auth/loginUser';
import { User } from '../../../src/domain/entities/User';
import * as jwtUtils from '../../../src/utils/jwt';

jest.mock('../../../src/utils/jwt', () => ({
  generateToken: jest.fn().mockReturnValue('mock-token')
}));

const mockRequest = () => {
  const req = {} as Request;
  req.body = {};
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.cookie = jest.fn().mockReturnThis();
  res.clearCookie = jest.fn().mockReturnThis();
  return res;
};
jest.mock('../../../src/application/use-cases/auth/loginUser');
const mockLoginUser = {
  execute: jest.fn()
} as unknown as jest.Mocked<LoginUser>;

describe('AuthController', () => {
  let authController: AuthController;
  let req: Request;
  let res: Response;
  
  const mockUserData = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com'
  };

  beforeEach(() => {
    authController = new AuthController(mockLoginUser);
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 200 and set cookie on successful login', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      mockLoginUser.execute.mockResolvedValue(new User(mockUserData));
      
      await authController.login(req, res);
      expect(mockLoginUser.execute).toHaveBeenCalledWith(req.body);
      expect(jwtUtils.generateToken).toHaveBeenCalledWith(
        mockUserData.id,
        mockUserData.name,
        mockUserData.email
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'mock-token',
        expect.objectContaining({
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: 'strict'
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: mockUserData,
        token: 'mock-token'
      });
    });

    it('should return 400 when login credentials are invalid', async () => {
      req.body = { email: 'test@example.com', password: 'wrong-password' };
      mockLoginUser.execute.mockResolvedValue(undefined);
      
      await authController.login(req, res);
      expect(mockLoginUser.execute).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Correo y/o contraseña incorrecta'
      });
    });

    it('should return 400 when login throws an error', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const error = new Error('Login failed');
      mockLoginUser.execute.mockRejectedValue(error);
      
      // Prevent actual logging in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await authController.login(req, res);
      expect(mockLoginUser.execute).toHaveBeenCalledWith(req.body);
      expect(consoleSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login failed'
      });
      
      // Restore console.error
      consoleSpy.mockRestore();
    });
  });

  describe('logout', () => {
    it('should clear cookie and return 200 on successful logout', async () => {
      await authController.logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logout successful'
      });
    });

    it('should return 500 when logout throws an error', async () => {
      // Mock clearCookie to throw error
      (res.clearCookie as jest.Mock).mockImplementation(() => {
        throw new Error('Logout error');
      });
      
      // Prevent actual logging in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await authController.logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(consoleSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error during logout'
      });
      
      // Restore console.error
      consoleSpy.mockRestore();
    });
  });
});
