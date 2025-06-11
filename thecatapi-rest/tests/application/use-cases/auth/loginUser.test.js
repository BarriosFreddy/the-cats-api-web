"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loginUser_1 = __importDefault(require("../../../../src/application/use-cases/auth/loginUser"));
const User_1 = require("../../../../src/domain/entities/User");
const mockUserRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};
describe('LoginUser Use Case', () => {
    let loginUser;
    beforeEach(() => {
        loginUser = new loginUser_1.default(mockUserRepository);
        jest.clearAllMocks();
    });
    it('should return user data without password if login is successful', async () => {
        const mockUser = new User_1.User({
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });
        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
        const result = await loginUser.execute({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(result).toBeDefined();
        expect(result?.id).toBe('123');
        expect(result?.email).toBe('test@example.com');
        expect(result?.name).toBe('Test User');
        // Password should not be included in result
        expect(result.password).toBeUndefined();
    });
    it('should return undefined if user is not found', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        const result = await loginUser.execute({
            email: 'nonexistent@example.com',
            password: 'anypassword'
        });
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
        expect(result).toBeUndefined();
    });
    it('should return undefined if password is incorrect', async () => {
        const mockUser = new User_1.User({
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: 'correctPassword'
        });
        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
        const result = await loginUser.execute({
            email: 'test@example.com',
            password: 'wrongPassword'
        });
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        expect(result).toBeUndefined();
    });
    it('should handle repository errors gracefully', async () => {
        mockUserRepository.findByEmail.mockRejectedValue(new Error('Database error'));
        await expect(loginUser.execute({
            email: 'test@example.com',
            password: 'password123'
        })).rejects.toThrow('Database error');
    });
});
