"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../src/utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
            jsonwebtoken_1.default.sign.mockReturnValue(mockToken);
            const token = (0, jwt_1.generateToken)(mockUserId, mockName, mockEmail);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ userId: mockUserId, name: mockName, email: mockEmail }, 'test-secret', // from our mocked EnvVariables
            { expiresIn: '24h' } // from our mocked EnvVariables
            );
            expect(token).toBe(mockToken);
        });
    });
    describe('verifyToken', () => {
        it('should verify and decode a valid token', () => {
            jsonwebtoken_1.default.verify.mockReturnValue(mockPayload);
            const result = (0, jwt_1.verifyToken)(mockToken);
            expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith(mockToken, 'test-secret');
            expect(result).toEqual(mockPayload);
        });
        it('should throw an error for an invalid token', () => {
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new Error('Token verification failed');
            });
            expect(() => (0, jwt_1.verifyToken)(mockToken)).toThrow('Invalid token');
        });
    });
    describe('extractUserFromToken', () => {
        it('should extract user data from a valid token', () => {
            jsonwebtoken_1.default.verify.mockReturnValue(mockPayload);
            const userData = (0, jwt_1.extractUserFromToken)(mockToken);
            expect(userData).toEqual({
                userId: mockUserId,
                name: mockName,
                email: mockEmail
            });
        });
        it('should throw an error when token is invalid', () => {
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new Error('Token verification failed');
            });
            expect(() => (0, jwt_1.extractUserFromToken)(mockToken)).toThrow('Invalid token');
        });
    });
});
