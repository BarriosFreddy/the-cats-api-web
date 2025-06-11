import UserRepositoryImpl from '../../../src/infrastructure/repositories/UserRepositoryImpl';
import { User } from '../../../src/domain/entities/User';
import { UserModel } from '../../../src/infrastructure/database/models/UserModel';

jest.mock('../../../src/infrastructure/database/models/UserModel');

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepositoryImpl;
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
    userRepository = new UserRepositoryImpl();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user and return the user entity', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue(mockUserDoc);
      
      const result = await userRepository.create(new User(mockUser));
      expect(UserModel.create).toHaveBeenCalledWith(mockUser);
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(mockUserId);
      expect(result.name).toBe(mockUser.name);
      expect(result.email).toBe(mockUser.email);
    });
    
    it('should throw an error if user creation fails', async () => {
      const mockError = new Error('Database error');
      (UserModel.create as jest.Mock).mockRejectedValue(mockError);
      
      await expect(userRepository.create(new User(mockUser)))
        .rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockDocs = [mockUserDoc, { ...mockUserDoc, _id: '60d21b4667d0d8992e610c86' }];
      (UserModel.find as jest.Mock).mockResolvedValue(mockDocs);
      
      const result = await userRepository.findAll();
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[0].id).toBe(mockUserId);
    });
    
    it('should return empty array when no users exist', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([]);
      
      const result = await userRepository.findAll();
      
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find and return user by id', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(mockUserDoc);
      
      const result = await userRepository.findById(mockUserId);
      expect(UserModel.findById).toHaveBeenCalledWith(mockUserId);
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(mockUserId);
      expect(result?.name).toBe(mockUser.name);
    });
    
    it('should return null if user id not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      
      const result = await userRepository.findById('nonexistentId');
      
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find and return user by email', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUserDoc);
      (UserModel.findOne as jest.Mock).mockReturnValue({ exec: execMock });
      
      const result = await userRepository.findByEmail(mockUser.email);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(mockUserId);
      expect(result?.email).toBe(mockUser.email);
      expect(result?.password).toBe(mockUser.password);  // Password should be included for auth
    });
    
    it('should return null if email not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      (UserModel.findOne as jest.Mock).mockReturnValue({ exec: execMock });
      
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
      
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedDoc);
      
      const result = await userRepository.update(mockUserId, new User(updatedUser));
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUserId,
        { name: updatedUser.name, email: updatedUser.email },
        { new: true }
      );
      expect(result).toBeInstanceOf(User);
      expect(result?.name).toBe('Updated Name');
    });
    
    it('should return null if user to update is not found', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      
      const result = await userRepository.update('nonexistentId', new User(mockUser));
      
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user and return true', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUserDoc);
      
      const result = await userRepository.delete(mockUserId);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(true);
    });
    
    it('should return false if user to delete is not found', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      
      const result = await userRepository.delete('nonexistentId');
      
      expect(result).toBe(false);
    });
  });
});
