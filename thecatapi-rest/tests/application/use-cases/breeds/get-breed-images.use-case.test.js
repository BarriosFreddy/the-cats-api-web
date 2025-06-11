"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBreedImagesUseCase_1 = require("../../../../src/application/use-cases/breeds/getBreedImagesUseCase");
const mockBreedRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findImagesByBreedId: jest.fn()
};
describe('GetBreedImagesUseCase', () => {
    let getBreedImagesUseCase;
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
    beforeEach(() => {
        getBreedImagesUseCase = new getBreedImagesUseCase_1.GetBreedImagesUseCase(mockBreedRepository);
        jest.clearAllMocks();
    });
    it('should return breed images with default limit', async () => {
        mockBreedRepository.findImagesByBreedId.mockResolvedValue(mockBreedImages);
        const result = await getBreedImagesUseCase.execute(mockBreedId);
        expect(mockBreedRepository.findImagesByBreedId).toHaveBeenCalledWith(mockBreedId, 10);
        expect(result).toEqual(mockBreedImages);
        expect(result.length).toBe(2);
    });
    it('should return breed images with custom limit', async () => {
        mockBreedRepository.findImagesByBreedId.mockResolvedValue(mockBreedImages);
        const customLimit = 5;
        const result = await getBreedImagesUseCase.execute(mockBreedId, customLimit);
        expect(mockBreedRepository.findImagesByBreedId).toHaveBeenCalledWith(mockBreedId, customLimit);
        expect(result).toEqual(mockBreedImages);
    });
    it('should return an empty array when no images are found', async () => {
        mockBreedRepository.findImagesByBreedId.mockResolvedValue([]);
        const result = await getBreedImagesUseCase.execute(mockBreedId);
        expect(mockBreedRepository.findImagesByBreedId).toHaveBeenCalledWith(mockBreedId, 10);
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });
    it('should propagate errors from the repository', async () => {
        mockBreedRepository.findImagesByBreedId.mockRejectedValue(new Error('Repository error'));
        await expect(getBreedImagesUseCase.execute(mockBreedId))
            .rejects.toThrow('Repository error');
        expect(mockBreedRepository.findImagesByBreedId).toHaveBeenCalledWith(mockBreedId, 10);
    });
});
