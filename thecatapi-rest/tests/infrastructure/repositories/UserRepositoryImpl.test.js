"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepositoryImpl_1 = __importDefault(require("../../../src/infrastructure/repositories/UserRepositoryImpl"));
const User_1 = require("../../../src/domain/entities/User");
const UserModel_1 = require("../../../src/infrastructure/database/models/UserModel");
jest.mock('../../../src/infrastructure/database/models/UserModel');
describe('UserRepositoryImpl', () => {
    let userRepository;
    const mockUserId = '60d21b4667d0d8992e610c85';
    const mockUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123'
    };
    const mockUserWithId = {
        ...mockUser,
        id: mockUserId
    };
    const mockUserDoc = {
        _id: mockUserId,
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        toObject: jest.fn().mockReturnValue({
            _id: mockUserId,
            name: mockUser.name,
            email: mockUser.email,
        }),
        toString: jest.fn().mockReturnValue(mockUserId),
    };
    beforeEach(() => {
        userRepository = new UserRepositoryImpl_1.default();
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('should create a new user and return the user entity', async () => {
            UserModel_1.UserModel.create.mockResolvedValue(mockUserDoc);
            const result = await userRepository.create(new User_1.User(mockUser));
            expect(UserModel_1.UserModel.create).toHaveBeenCalledWith(mockUser);
            expect(result).toBeInstanceOf(User_1.User);
            expect(result.id).toBe(mockUserId);
            expect(result.name).toBe(mockUser.name);
            expect(result.email).toBe(mockUser.email);
        });
        it('should throw an error if user creation fails', async () => {
            const mockError = new Error('Database error');
            UserModel_1.UserModel.create.mockRejectedValue(mockError);
            await expect(userRepository.create(new User_1.User(mockUser)))
                .rejects.toThrow('Database error');
        });
    });
    describe('findAll', () => {
        it('should return all users', async () => {
            const mockDocs = [mockUserDoc, { ...mockUserDoc, _id: '60d21b4667d0d8992e610c86' }];
            UserModel_1.UserModel.find.mockResolvedValue(mockDocs);
            const result = await userRepository.findAll();
            expect(UserModel_1.UserModel.find).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(User_1.User);
            expect(result[0].id).toBe(mockUserId);
        });
        it('should return empty array when no users exist', async () => {
            UserModel_1.UserModel.find.mockResolvedValue([]);
            const result = await userRepository.findAll();
            expect(result).toEqual([]);
        });
    });
    describe('findById', () => {
        it('should find and return user by id', async () => {
            UserModel_1.UserModel.findById.mockResolvedValue(mockUserDoc);
            const result = await userRepository.findById(mockUserId);
            expect(UserModel_1.UserModel.findById).toHaveBeenCalledWith(mockUserId);
            expect(result).toBeInstanceOf(User_1.User);
            expect(result?.id).toBe(mockUserId);
            expect(result?.name).toBe(mockUser.name);
        });
        it('should return null if user id not found', async () => {
            UserModel_1.UserModel.findById.mockResolvedValue(null);
            const result = await userRepository.findById('nonexistentId');
            expect(result).toBeNull();
        });
    });
    describe('findByEmail', () => {
        it('should find and return user by email', async () => {
            const execMock = jest.fn().mockResolvedValue(mockUserDoc);
            UserModel_1.UserModel.findOne.mockReturnValue({ exec: execMock });
            const result = await userRepository.findByEmail(mockUser.email);
            expect(UserModel_1.UserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
            expect(result).toBeInstanceOf(User_1.User);
            expect(result?.id).toBe(mockUserId);
            expect(result?.email).toBe(mockUser.email);
            expect(result?.password).toBe(mockUser.password); // Password should be included for auth
        });
        it('should return null if email not found', async () => {
            const execMock = jest.fn().mockResolvedValue(null);
            UserModel_1.UserModel.findOne.mockReturnValue({ exec: execMock });
            const result = await userRepository.findByEmail('nonexistent@example.com');
            expect(result).toBeNull();
        });
    });
    describe('update', () => {
        it('should update and return the updated user', async () => {
            const updatedUser = {
                ...mockUser,
                name: 'Updated Name'
            };
            const updatedDoc = {
                ...mockUserDoc,
                name: 'Updated Name'
            };
            UserModel_1.UserModel.findByIdAndUpdate.mockResolvedValue(updatedDoc);
            const result = await userRepository.update(mockUserId, new User_1.User(updatedUser));
            expect(UserModel_1.UserModel.findByIdAndUpdate).toHaveBeenCalledWith(mockUserId, { name: updatedUser.name, email: updatedUser.email }, { new: true });
            expect(result).toBeInstanceOf(User_1.User);
            expect(result?.name).toBe('Updated Name');
        });
        it('should return null if user to update is not found', async () => {
            UserModel_1.UserModel.findByIdAndUpdate.mockResolvedValue(null);
            const result = await userRepository.update('nonexistentId', new User_1.User(mockUser));
            expect(result).toBeNull();
        });
    });
    describe('delete', () => {
        it('should delete a user and return true', async () => {
            UserModel_1.UserModel.findByIdAndDelete.mockResolvedValue(mockUserDoc);
            const result = await userRepository.delete(mockUserId);
            expect(UserModel_1.UserModel.findByIdAndDelete).toHaveBeenCalledWith(mockUserId);
            expect(result).toBe(true);
        });
        it('should return false if user to delete is not found', async () => {
            UserModel_1.UserModel.findByIdAndDelete.mockResolvedValue(null);
            const result = await userRepository.delete('nonexistentId');
            expect(result).toBe(false);
        });
    });
});
