"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("../../../src/interfaces/rest/controllers/authController"));
const User_1 = require("../../../src/domain/entities/User");
const jwtUtils = __importStar(require("../../../src/utils/jwt"));
jest.mock('../../../src/utils/jwt', () => ({
    generateToken: jest.fn().mockReturnValue('mock-token')
}));
const mockRequest = () => {
    const req = {};
    req.body = {};
    return req;
};
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.cookie = jest.fn().mockReturnThis();
    res.clearCookie = jest.fn().mockReturnThis();
    return res;
};
jest.mock('../../../src/application/use-cases/auth/loginUser');
const mockLoginUser = {
    execute: jest.fn()
};
describe('AuthController', () => {
    let authController;
    let req;
    let res;
    const mockUserData = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com'
    };
    beforeEach(() => {
        authController = new authController_1.default(mockLoginUser);
        req = mockRequest();
        res = mockResponse();
        jest.clearAllMocks();
    });
    describe('login', () => {
        it('should return 200 and set cookie on successful login', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };
            mockLoginUser.execute.mockResolvedValue(new User_1.User(mockUserData));
            await authController.login(req, res);
            expect(mockLoginUser.execute).toHaveBeenCalledWith(req.body);
            expect(jwtUtils.generateToken).toHaveBeenCalledWith(mockUserData.id, mockUserData.name, mockUserData.email);
            expect(res.cookie).toHaveBeenCalledWith('token', 'mock-token', expect.objectContaining({
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            }));
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
            res.clearCookie.mockImplementation(() => {
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
