import { GetAllBreedsUseCase } from '../../../../src/application/use-cases/breeds/getAllBreedsUseCase';
import { BreedRepository } from '../../../../src/domain/repositories/BreedRepository';
import { Breed } from '../../../../src/domain/entities/Breed';

const mockBreedRepository: jest.Mocked<BreedRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findImagesByBreedId: jest.fn()
};

describe('GetAllBreedsUseCase', () => {
  let getAllBreedsUseCase: GetAllBreedsUseCase;
  const mockBreeds: Breed[] = [
    {
      id: 'abys',
      name: 'Abyssinian',
      description: 'The Abyssinian is easy to care for, and a joy to have in your home.',
      temperament: 'Active, Energetic, Independent, Intelligent, Gentle',
      origin: 'Egypt',
      life_span: '14 - 15',
      weight: { imperial: '7 - 10', metric: '3 - 5' },
      adaptability: 5,
      affection_level: 5,
      child_friendly: 3,
      dog_friendly: 4,
      energy_level: 5,
      grooming: 1,
      health_issues: 2,
      intelligence: 5,
      social_needs: 5,
      stranger_friendly: 5
    },
    {
      id: 'beng',
      name: 'Bengal',
      description: 'Bengals are a lot of fun to live with, but they\'re definitely not the cat for everyone.',
      temperament: 'Alert, Agile, Energetic, Demanding, Intelligent',
      origin: 'United States',
      life_span: '12 - 15',
      weight: { imperial: '8 - 15', metric: '4 - 7' },
      adaptability: 5,
      affection_level: 5,
      child_friendly: 4,
      dog_friendly: 4,
      energy_level: 5,
      grooming: 1,
      health_issues: 3,
      intelligence: 5,
      social_needs: 5,
      stranger_friendly: 4
    }
  ];

  beforeEach(() => {
    getAllBreedsUseCase = new GetAllBreedsUseCase(mockBreedRepository);
    jest.clearAllMocks();
  });

  it('should return all breeds', async () => {
    mockBreedRepository.findAll.mockResolvedValue(mockBreeds);
    
    const result = await getAllBreedsUseCase.execute();
    
    expect(mockBreedRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockBreeds);
    expect(result.length).toBe(2);
  });

  it('should return an empty array when no breeds are found', async () => {
    mockBreedRepository.findAll.mockResolvedValue([]);
    
    const result = await getAllBreedsUseCase.execute();
    
    expect(mockBreedRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it('should propagate errors from the repository', async () => {
    mockBreedRepository.findAll.mockRejectedValue(new Error('Repository error'));
    
    await expect(getAllBreedsUseCase.execute())
      .rejects.toThrow('Repository error');
    
    expect(mockBreedRepository.findAll).toHaveBeenCalled();
  });
});
