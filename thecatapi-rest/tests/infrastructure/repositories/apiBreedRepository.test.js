"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiBreedImpl_1 = require("../../../src/infrastructure/repositories/ApiBreedImpl");
const axios_1 = __importDefault(require("axios"));
jest.mock('axios');
jest.mock('../../../src/config/EnvVariables', () => ({
    CAT_API_URL: 'https://api.thecatapi.com/v1',
    CAT_API_KEY: 'test-api-key'
}));
describe('ApiBreedRepository', () => {
    let repository;
    beforeEach(() => {
        repository = new ApiBreedImpl_1.ApiBreedRepository();
        jest.clearAllMocks();
    });
    describe('findAll', () => {
        it('should return all breeds when API call succeeds', async () => {
            const mockBreeds = [
                {
                    id: 'abys',
                    name: 'Abyssinian',
                    temperament: 'Active, Energetic',
                    origin: 'Egypt',
                    description: 'The Abyssinian is easy to care for',
                    life_span: '14 - 15',
                    wikipedia_url: 'https://en.wikipedia.org/wiki/Abyssinian_(cat)',
                    weight: { imperial: '8 - 12', metric: '4 - 5' },
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
                    id: 'aege',
                    name: 'Aegean',
                    temperament: 'Affectionate, Social',
                    origin: 'Greece',
                    description: 'Native to the Greek islands',
                    life_span: '9 - 12',
                    wikipedia_url: 'https://en.wikipedia.org/wiki/Aegean_cat',
                    weight: { imperial: '7 - 10', metric: '3 - 5' },
                    adaptability: 5,
                    affection_level: 4,
                    child_friendly: 4,
                    dog_friendly: 4,
                    energy_level: 3,
                    grooming: 3,
                    health_issues: 1,
                    intelligence: 3,
                    social_needs: 4,
                    stranger_friendly: 4
                }
            ];
            axios_1.default.get.mockResolvedValue({ data: mockBreeds });
            const result = await repository.findAll();
            expect(axios_1.default.get).toHaveBeenCalledWith('https://api.thecatapi.com/v1/breeds', { headers: { 'x-api-key': 'test-api-key' } });
            expect(result).toEqual(mockBreeds);
        });
        it('should return an empty array when API call fails', async () => {
            axios_1.default.get.mockRejectedValue(new Error('Network error'));
            const result = await repository.findAll();
            expect(axios_1.default.get).toHaveBeenCalledWith('https://api.thecatapi.com/v1/breeds', { headers: { 'x-api-key': 'test-api-key' } });
            expect(result).toEqual([]);
        });
    });
    describe('findById', () => {
        it('should return a breed when API call succeeds', async () => {
            const mockBreed = {
                id: 'abys',
                name: 'Abyssinian',
                temperament: 'Active, Energetic',
                origin: 'Egypt',
                description: 'The Abyssinian is easy to care for',
                life_span: '14 - 15',
                wikipedia_url: 'https://en.wikipedia.org/wiki/Abyssinian_(cat)',
                weight: { imperial: '8 - 12', metric: '4 - 5' },
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
            };
            axios_1.default.get.mockResolvedValue({ data: mockBreed });
            const result = await repository.findById('abys');
            expect(axios_1.default.get).toHaveBeenCalledWith('https://api.thecatapi.com/v1/breeds/abys', { headers: { 'x-api-key': 'test-api-key' } });
            expect(result).toEqual(mockBreed);
        });
        it('should return null when API call fails', async () => {
            axios_1.default.get.mockRejectedValue(new Error('Not found'));
            const result = await repository.findById('invalid-id');
            expect(axios_1.default.get).toHaveBeenCalledWith('https://api.thecatapi.com/v1/breeds/invalid-id', { headers: { 'x-api-key': 'test-api-key' } });
            expect(result).toBeNull();
        });
    });
    describe('findImagesByBreedId', () => {
        it('should return breed images with default limit when API call succeeds', async () => {
            // Mock data
            const mockImages = [
                {
                    id: 'img1',
                    url: 'https://cdn2.thecatapi.com/images/img1.jpg',
                    width: 640,
                    height: 480
                },
                {
                    id: 'img2',
                    url: 'https://cdn2.thecatapi.com/images/img2.jpg',
                    width: 800,
                    height: 600
                }
            ];
            axios_1.default.get.mockResolvedValue({ data: mockImages });
            const result = await repository.findImagesByBreedId('abys');
            expect(axios_1.default.get).toHaveBeenCalledWith('https://api.thecatapi.com/v1/images/search', {
                headers: { 'x-api-key': 'test-api-key' },
                params: { breed_ids: 'abys', limit: 10 }
            });
            expect(result).toEqual(mockImages);
        });
        it('should return breed images with custom limit when API call succeeds', async () => {
            // Mock data
            const mockImages = [
                {
                    id: 'img1',
                    url: 'https://cdn2.thecatapi.com/images/img1.jpg',
                    width: 640,
                    height: 480
                },
                {
                    id: 'img2',
                    url: 'https://cdn2.thecatapi.com/images/img2.jpg',
                    width: 800,
                    height: 600
                },
                {
                    id: 'img3',
                    url: 'https://cdn2.thecatapi.com/images/img3.jpg',
                    width: 720,
                    height: 540
                }
            ];
            axios_1.default.get.mockResolvedValue({ data: mockImages });
            const result = await repository.findImagesByBreedId('abys', 3);
            expect(axios_1.default.get).toHaveBeenCalledWith('https://api.thecatapi.com/v1/images/search', {
                headers: { 'x-api-key': 'test-api-key' },
                params: { breed_ids: 'abys', limit: 3 }
            });
            expect(result).toEqual(mockImages);
        });
        it('should return an empty array when API call fails', async () => {
            axios_1.default.get.mockRejectedValue(new Error('Network error'));
            const result = await repository.findImagesByBreedId('abys');
            expect(axios_1.default.get).toHaveBeenCalledWith('https://api.thecatapi.com/v1/images/search', {
                headers: { 'x-api-key': 'test-api-key' },
                params: { breed_ids: 'abys', limit: 10 }
            });
            expect(result).toEqual([]);
        });
    });
});
