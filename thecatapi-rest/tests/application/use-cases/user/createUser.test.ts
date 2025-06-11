import CreateUser from '../../../../src/application/use-cases/user/createUser';
import { UserRepository } from '../../../../src/domain/repositories/UserRepository';
import { User } from '../../../../src/domain/entities/User';

const mockUserRepository: jest.Mocked<UserRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

describe('CreateUser Use Case', () => {
  let createUser: CreateUser;
  const mockUserData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };
  
  const mockCreatedUser = new User({
    id: '123',
    ...mockUserData
  });

  beforeEach(() => {
    createUser = new CreateUser(mockUserRepository);
    jest.clearAllMocks();
  });

  it('should create a new user when email does not exist', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(mockCreatedUser);
    
    const result = await createUser.execute(mockUserData);
    
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
    expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
    expect(result).toEqual(mockCreatedUser);
    expect(result.id).toBe('123');
  });

  it('should throw an error when user with email already exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(new User({ id: 'existing-id', ...mockUserData }));
    
    await expect(createUser.execute(mockUserData))
      .rejects.toThrow('User already exists');
    
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should propagate repository errors during findByEmail', async () => {
    mockUserRepository.findByEmail.mockRejectedValue(new Error('Database error'));
    
    await expect(createUser.execute(mockUserData))
      .rejects.toThrow('Database error');
    
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
  
  it('should propagate repository errors during create', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockRejectedValue(new Error('Create failed'));
    
    await expect(createUser.execute(mockUserData))
      .rejects.toThrow('Create failed');
    
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
    expect(mockUserRepository.create).toHaveBeenCalled();
  });
});
