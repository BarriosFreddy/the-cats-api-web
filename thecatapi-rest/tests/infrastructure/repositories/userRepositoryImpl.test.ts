import UserRepositoryImpl from '../../../src/infrastructure/repositories/UserRepositoryImpl';
import { User } from '../../../src/domain/entities/User';
import { UserModel } from '../../../src/infrastructure/database/models/UserModel';

// Mock UserModel
jest.mock('../../../src/infrastructure/database/models/UserModel', () => {
  const mockExecFunction = jest.fn();
  return {
    UserModel: {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn().mockReturnValue({ exec: mockExecFunction }),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn()
    }
  };
});

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepositoryImpl;
  const mockUser = new User({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword123'
  });

  const mockMongoUser = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword123',
    toObject: jest.fn().mockReturnValue({
      _id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123'
    })
  };

  beforeEach(() => {
    userRepository = new UserRepositoryImpl();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user and return it', async () => {
      // Mock UserModel.create to return a mock document
      (UserModel.create as jest.Mock).mockResolvedValue(mockMongoUser);

      const result = await userRepository.create(mockUser);

      // Check method was called with correct data
      expect(UserModel.create).toHaveBeenCalledWith(mockUser);

      // Check returned user has correct properties
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('1');
      expect(result.name).toBe('Test User');
      expect(result.email).toBe('test@example.com');
      // Password should not be returned
      expect(result.password).toBeUndefined();
    });

    it('should throw an error if creation fails', async () => {
      // Mock UserModel.create to throw an error
      const error = new Error('Database error');
      (UserModel.create as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.create(mockUser)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Mock UserModel.find to return an array of users
      const mockMongoUsers = [
        mockMongoUser,
        {
          _id: '2',
          name: 'Another User',
          email: 'another@example.com',
          password: 'hashedpassword456',
          toObject: jest.fn()
        }
      ];
      (UserModel.find as jest.Mock).mockResolvedValue(mockMongoUsers);

      const results = await userRepository.findAll();

      // Check method was called
      expect(UserModel.find).toHaveBeenCalled();

      // Check returned users
      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(User);
      expect(results[0].id).toBe('1');
      expect(results[1].id).toBe('2');
      expect(results[0].email).toBe('test@example.com');
    });

    it('should return an empty array if no users found', async () => {
      // Mock UserModel.find to return an empty array
      (UserModel.find as jest.Mock).mockResolvedValue([]);

      const results = await userRepository.findAll();

      expect(UserModel.find).toHaveBeenCalled();
      expect(results).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a user by id when found', async () => {
      // Mock UserModel.findById to return a user
      (UserModel.findById as jest.Mock).mockResolvedValue(mockMongoUser);

      const result = await userRepository.findById('1');

      // Check method was called with correct id
      expect(UserModel.findById).toHaveBeenCalledWith('1');

      // Check returned user
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('1');
      expect(result?.name).toBe('Test User');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null when user is not found', async () => {
      // Mock UserModel.findById to return null
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findById('999');

      expect(UserModel.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email when found', async () => {
      // Mock UserModel.findOne().exec() to return a user
      const execMock = jest.fn().mockResolvedValue(mockMongoUser);
      (UserModel.findOne as jest.Mock).mockReturnValue({ exec: execMock });

      const result = await userRepository.findByEmail('test@example.com');

      // Check method was called with correct email query
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(execMock).toHaveBeenCalled();

      // Check returned user
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('1');
      expect(result?.name).toBe('Test User');
      expect(result?.email).toBe('test@example.com');
      // Password should be included in findByEmail for authentication
      expect(result?.password).toBe('hashedpassword123');
    });

    it('should return null when email is not found', async () => {
      // Mock UserModel.findOne().exec() to return null
      const execMock = jest.fn().mockResolvedValue(null);
      (UserModel.findOne as jest.Mock).mockReturnValue({ exec: execMock });

      const result = await userRepository.findByEmail('nonexistent@example.com');

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updatedMockMongoUser = {
        _id: '1',
        name: 'Updated Name',
        email: 'updated@example.com',
        toObject: jest.fn()
      };
      
      const updateData = new User({
        id: '1',
        name: 'Updated Name',
        email: 'updated@example.com'
      });

      // Mock UserModel.findByIdAndUpdate to return updated user
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedMockMongoUser);

      const result = await userRepository.update('1', updateData);

      // Check method was called with correct parameters
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { name: 'Updated Name', email: 'updated@example.com' },
        { new: true }
      );

      // Check returned user
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('1');
      expect(result?.name).toBe('Updated Name');
      expect(result?.email).toBe('updated@example.com');
    });

    it('should return null when user to update is not found', async () => {
      // Mock UserModel.findByIdAndUpdate to return null
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const updateData = new User({
        id: '999',
        name: 'Will Not Update',
        email: 'wont@update.com'
      });

      const result = await userRepository.update('999', updateData);

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user and return true when successful', async () => {
      // Mock UserModel.findByIdAndDelete to return deleted user
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockMongoUser);

      const result = await userRepository.delete('1');

      // Check method was called with correct id
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      
      // Check result
      expect(result).toBe(true);
    });

    it('should return false when user to delete is not found', async () => {
      // Mock UserModel.findByIdAndDelete to return null
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.delete('999');

      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith('999');
      expect(result).toBe(false);
    });
  });
});
