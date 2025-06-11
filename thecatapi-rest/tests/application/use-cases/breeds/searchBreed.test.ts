import SearchBreedUseCase from '../../../../src/application/use-cases/breeds/searchBreedUseCase';
import axios from 'axios';

jest.mock('../../../../src/config/Axios', () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn()
    }
  };
});

jest.mock('../../../../src/config/EnvVariables', () => ({
  CAT_API_URL: 'https://api.thecatapi.com/v1',
  CAT_API_KEY: 'test-api-key'
}));

describe('SearchBreed Use Case', () => {
  let searchBreed: SearchBreedUseCase;
  const axiosInstance = require('../../../../src/config/Axios').default;
  
  beforeEach(() => {
    searchBreed = new SearchBreedUseCase();
    jest.clearAllMocks();
  });
  
  it('should return breed data when search is successful', async () => {
    const mockSearchResults = [
      {
        id: 'sibe',
        name: 'Siberian',
        temperament: 'Curious, Intelligent, Loyal',
        origin: 'Russia',
        description: 'The Siberian is a medium to large-sized cat with strong muscles.',
        weight: { imperial: '8 - 16', metric: '4 - 7' },
        life_span: '12 - 15'
      },
      {
        id: 'siam',
        name: 'Siamese',
        temperament: 'Active, Agile, Clever',
        origin: 'Thailand',
        description: 'The Siamese is one of the oldest breeds of domestic cat.',
        weight: { imperial: '6 - 10', metric: '3 - 5' },
        life_span: '12 - 15'
      }
    ];
    
    axiosInstance.get.mockResolvedValue({
      status: 200,
      data: mockSearchResults
    });
    
    const result = await searchBreed.execute('si');
    
    expect(axiosInstance.get).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/breeds/search?q=si',
      {
        headers: { 'x-api-key': 'test-api-key' }
      }
    );
    expect(result).toEqual(mockSearchResults);
  });
  
  it('should return empty array when search returns no results', async () => {
    axiosInstance.get.mockResolvedValue({
      status: 200,
      data: []
    });
    
    const result = await searchBreed.execute('nonexistentbreed');
    
    expect(axiosInstance.get).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/breeds/search?q=nonexistentbreed',
      {
        headers: { 'x-api-key': 'test-api-key' }
      }
    );
    expect(result).toEqual([]);
  });
  
  it('should return empty array when API status is not 200', async () => {
    axiosInstance.get.mockResolvedValue({
      status: 404,
      data: null
    });
    
    const result = await searchBreed.execute('test');
    
    expect(axiosInstance.get).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/breeds/search?q=test',
      {
        headers: { 'x-api-key': 'test-api-key' }
      }
    );
    expect(result).toEqual([]);
  });
  
  it('should return empty array when API call fails', async () => {
    axiosInstance.get.mockRejectedValue(new Error('Network error'));
    
    const result = await searchBreed.execute('test');
    
    expect(axiosInstance.get).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/breeds/search?q=test',
      {
        headers: { 'x-api-key': 'test-api-key' }
      }
    );
    expect(result).toEqual([]);
  });
  
  it('should log error when API call fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const error = new Error('API error');
    
    axiosInstance.get.mockRejectedValue(error);
    
    await searchBreed.execute('test');
    
    expect(consoleSpy).toHaveBeenCalledWith(error);
    
    consoleSpy.mockRestore();
  });
});
