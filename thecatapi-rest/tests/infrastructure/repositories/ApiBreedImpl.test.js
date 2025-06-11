"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ApiBreedImpl_1 = require("../../../src/infrastructure/repositories/ApiBreedImpl");
const EnvVariables_1 = require("../../../src/config/EnvVariables");
jest.mock('axios');
jest.mock('../../../src/config/EnvVariables', () => ({
    CAT_API_KEY: 'test-api-key',
    CAT_API_URL: 'https://api.thecatapi.com/v1'
}));
describe('ApiBreedRepository', () => {
    let apiBreedRepository;
    const mockHeaders = { 'x-api-key': 'test-api-key' };
    beforeEach(() => {
        apiBreedRepository = new ApiBreedImpl_1.ApiBreedRepository();
        jest.clearAllMocks();
    });
    describe('findAll', () => {
        it('should return breeds from the API', async () => {
            const mockBreeds = [
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
            axios_1.default.get.mockResolvedValueOnce({
                data: mockBreeds
            });
            const result = await apiBreedRepository.findAll();
            expect(axios_1.default.get).toHaveBeenCalledWith(`${EnvVariables_1.CAT_API_URL}/breeds`, { headers: mockHeaders });
            expect(result).toEqual(mockBreeds);
            expect(result.length).toBe(2);
        });
        it('should return empty array if API request fails', async () => {
            // Mock axios.get to throw an error
            axios_1.default.get.mockRejectedValueOnce(new Error('API Error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            const result = await apiBreedRepository.findAll();
            expect(axios_1.default.get).toHaveBeenCalledWith(`${EnvVariables_1.CAT_API_URL}/breeds`, { headers: mockHeaders });
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(result).toEqual([]);
            // Restore console.error
            consoleErrorSpy.mockRestore();
        });
    });
    describe('findById', () => {
        const mockBreedId = 'beng';
        const mockBreed = {
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
        };
        it('should return a breed by ID from the API', async () => {
            // Mock the axios.get response
            axios_1.default.get.mockResolvedValueOnce({ data: mockBreed });
            const result = await apiBreedRepository.findById(mockBreedId);
            // Assertions
            expect(axios_1.default.get).toHaveBeenCalledWith(`${EnvVariables_1.CAT_API_URL}/breeds/${mockBreedId}`, { headers: mockHeaders });
            expect(result).toEqual(mockBreed);
        });
        it('should return null if API request fails', async () => {
            // Mock axios.get to throw an error
            axios_1.default.get.mockRejectedValueOnce(new Error('API Error'));
            // Spy on console.error
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            const result = await apiBreedRepository.findById(mockBreedId);
            // Assertions
            expect(axios_1.default.get).toHaveBeenCalledWith(`${EnvVariables_1.CAT_API_URL}/breeds/${mockBreedId}`, { headers: mockHeaders });
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(result).toBeNull();
            // Restore console.error
            consoleErrorSpy.mockRestore();
        });
    });
    describe('findImagesByBreedId', () => {
        const mockBreedId = 'beng';
        const mockBreedImages = [
            {
                id: 'img1',
                url: 'https://cdn2.thecatapi.com/images/MTk3ODQ5Mw.jpg',
                width: 1204,
                height: 1445
            },
            {
                id: 'img2',
                url: 'https://cdn2.thecatapi.com/images/JFPROfGtQ.jpg',
                width: 1100,
                height: 619
            }
        ];
        it('should return breed images from the API with default limit', async () => {
            // Mock the axios.get response
            axios_1.default.get.mockResolvedValueOnce({ data: mockBreedImages });
            const result = await apiBreedRepository.findImagesByBreedId(mockBreedId);
            // Assertions
            expect(axios_1.default.get).toHaveBeenCalledWith(`${EnvVariables_1.CAT_API_URL}/images/search`, {
                headers: mockHeaders,
                params: {
                    breed_ids: mockBreedId,
                    limit: 10
                }
            });
            expect(result).toEqual(mockBreedImages);
            expect(result.length).toBe(2);
        });
        it('should return breed images with specified limit', async () => {
            // Mock the axios.get response
            axios_1.default.get.mockResolvedValueOnce({ data: mockBreedImages });
            const limit = 5;
            const result = await apiBreedRepository.findImagesByBreedId(mockBreedId, limit);
            // Assertions
            expect(axios_1.default.get).toHaveBeenCalledWith(`${EnvVariables_1.CAT_API_URL}/images/search`, {
                headers: mockHeaders,
                params: {
                    breed_ids: mockBreedId,
                    limit: 5
                }
            });
            expect(result).toEqual(mockBreedImages);
        });
        it('should return empty array if API request fails', async () => {
            // Mock axios.get to throw an error
            axios_1.default.get.mockRejectedValueOnce(new Error('API Error'));
            // Spy on console.error
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            const result = await apiBreedRepository.findImagesByBreedId(mockBreedId);
            // Assertions
            expect(axios_1.default.get).toHaveBeenCalledWith(`${EnvVariables_1.CAT_API_URL}/images/search`, {
                headers: mockHeaders,
                params: {
                    breed_ids: mockBreedId,
                    limit: 10
                }
            });
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(result).toEqual([]);
            // Restore console.error
            consoleErrorSpy.mockRestore();
        });
    });
});
