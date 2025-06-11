import { generateToken, verifyToken, extractUserFromToken } from '../../src/utils/jwt';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

jest.mock('../../src/config/EnvVariables', () => ({
  JWT_SECRET: 'test-secret',
  JWT_EXPIRES_IN: '24h'
}));

describe('JWT Utilities', () => {
  const mockUserId = '123';
  const mockName = 'Test User';
  const mockEmail = 'test@example.com';
  const mockToken = 'mock-jwt-token';
  const mockPayload = { userId: mockUserId, name: mockName, email: mockEmail };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token with the correct payload and options', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      
      const token = generateToken(mockUserId, mockName, mockEmail);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUserId, name: mockName, email: mockEmail },
        'test-secret', // from our mocked EnvVariables
        { expiresIn: '24h' } // from our mocked EnvVariables
      );
      
      expect(token).toBe(mockToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
      
      const result = verifyToken(mockToken);
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret');
      
      expect(result).toEqual(mockPayload);
    });
    
    it('should throw an error for an invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token verification failed');
      });
      expect(() => verifyToken(mockToken)).toThrow('Invalid token');
    });
  });

  describe('extractUserFromToken', () => {
    it('should extract user data from a valid token', () => {
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
      
      const userData = extractUserFromToken(mockToken);
      expect(userData).toEqual({
        userId: mockUserId,
        name: mockName,
        email: mockEmail
      });
    });
    
    it('should throw an error when token is invalid', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token verification failed');
      });
      expect(() => extractUserFromToken(mockToken)).toThrow('Invalid token');
    });
  });
});
