"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const breedController_1 = require("../../../src/interfaces/rest/controllers/breedController");
const getAllBreedsUseCase_1 = require("../../../src/application/use-cases/breeds/getAllBreedsUseCase");
const getBreedByIdUseCase_1 = require("../../../src/application/use-cases/breeds/getBreedByIdUseCase");
const getBreedImagesUseCase_1 = require("../../../src/application/use-cases/breeds/getBreedImagesUseCase");
const searchBreedUseCase_1 = __importDefault(require("../../../src/application/use-cases/breeds/searchBreedUseCase"));
jest.mock('../../../src/application/use-cases/breeds/getAllBreedsUseCase');
jest.mock('../../../src/application/use-cases/breeds/getBreedByIdUseCase');
jest.mock('../../../src/application/use-cases/breeds/getBreedImagesUseCase');
jest.mock('../../../src/application/use-cases/breeds/searchBreed');
const mockRequest = () => {
    const req = {};
    req.params = {};
    req.query = {};
    return req;
};
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
};
describe('BreedController', () => {
    let breedController;
    let req;
    let res;
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
    const mockBreed = mockBreeds[0];
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
    beforeEach(() => {
        jest.resetAllMocks();
        req = mockRequest();
        res = mockResponse();
        breedController = new breedController_1.BreedController();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('getAllBreeds', () => {
        it('should return all breeds with status 200', async () => {
            getAllBreedsUseCase_1.GetAllBreedsUseCase.prototype.execute.mockResolvedValue(mockBreeds);
            await breedController.getAllBreeds(req, res);
            expect(getAllBreedsUseCase_1.GetAllBreedsUseCase.prototype.execute).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBreeds);
        });
        it('should handle errors and return 500', async () => {
            getAllBreedsUseCase_1.GetAllBreedsUseCase.prototype.execute.mockRejectedValue(new Error('API error'));
            await breedController.getAllBreeds(req, res);
            expect(getAllBreedsUseCase_1.GetAllBreedsUseCase.prototype.execute).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching breeds' });
        });
    });
    describe('getBreedById', () => {
        it('should return a breed with status 200 when found', async () => {
            req.params.id = 'abys';
            getBreedByIdUseCase_1.GetBreedByIdUseCase.prototype.execute.mockResolvedValue(mockBreed);
            await breedController.getBreedById(req, res);
            expect(getBreedByIdUseCase_1.GetBreedByIdUseCase.prototype.execute).toHaveBeenCalledWith('abys');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBreed);
        });
        it('should return 404 when breed is not found', async () => {
            req.params.id = 'nonexistent';
            getBreedByIdUseCase_1.GetBreedByIdUseCase.prototype.execute.mockResolvedValue(null);
            await breedController.getBreedById(req, res);
            expect(getBreedByIdUseCase_1.GetBreedByIdUseCase.prototype.execute).toHaveBeenCalledWith('nonexistent');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Breed with id nonexistent not found' });
        });
        it('should handle errors and return 500', async () => {
            req.params.id = 'abys';
            getBreedByIdUseCase_1.GetBreedByIdUseCase.prototype.execute.mockRejectedValue(new Error('API error'));
            await breedController.getBreedById(req, res);
            expect(getBreedByIdUseCase_1.GetBreedByIdUseCase.prototype.execute).toHaveBeenCalledWith('abys');
            expect(console.error).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching breed' });
        });
    });
    describe('getBreedImages', () => {
        it('should return breed images with status 200 with default limit', async () => {
            req.params.id = 'abys';
            getBreedImagesUseCase_1.GetBreedImagesUseCase.prototype.execute.mockResolvedValue(mockBreedImages);
            await breedController.getBreedImages(req, res);
            expect(getBreedImagesUseCase_1.GetBreedImagesUseCase.prototype.execute).toHaveBeenCalledWith('abys', 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBreedImages);
        });
        it('should return breed images with status 200 with custom limit', async () => {
            req.params.id = 'abys';
            req.query.limit = '5';
            getBreedImagesUseCase_1.GetBreedImagesUseCase.prototype.execute.mockResolvedValue(mockBreedImages);
            await breedController.getBreedImages(req, res);
            expect(getBreedImagesUseCase_1.GetBreedImagesUseCase.prototype.execute).toHaveBeenCalledWith('abys', 5);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBreedImages);
        });
        it('should handle errors and return 500', async () => {
            req.params.id = 'abys';
            getBreedImagesUseCase_1.GetBreedImagesUseCase.prototype.execute.mockRejectedValue(new Error('API error'));
            await breedController.getBreedImages(req, res);
            expect(getBreedImagesUseCase_1.GetBreedImagesUseCase.prototype.execute).toHaveBeenCalledWith('abys', 10);
            expect(console.error).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching breed images' });
        });
    });
    describe('findBreed', () => {
        it('should search for breeds when query is provided', async () => {
            req.query.q = 'bengal';
            searchBreedUseCase_1.default.prototype.execute.mockResolvedValue([mockBreeds[1]]);
            await breedController.findBreed(req, res);
            expect(searchBreedUseCase_1.default.prototype.execute).toHaveBeenCalledWith('bengal');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockBreeds[1]]);
        });
        it('should handle errors and return 400', async () => {
            req.query.q = 'bengal';
            const error = new Error('Search error');
            searchBreedUseCase_1.default.prototype.execute.mockRejectedValue(error);
            await breedController.findBreed(req, res);
            expect(searchBreedUseCase_1.default.prototype.execute).toHaveBeenCalledWith('bengal');
            expect(console.error).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Search error' });
        });
    });
});
