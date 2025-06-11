"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBreedByIdUseCase_1 = require("../../../../src/application/use-cases/breeds/getBreedByIdUseCase");
const mockBreedRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findImagesByBreedId: jest.fn()
};
describe('GetBreedByIdUseCase', () => {
    let getBreedByIdUseCase;
    const mockBreedId = 'beng';
    const mockBreed = {
        id: 'beng',
        name: 'Bengal',
        description: "Bengals are a lot of fun to live with, but they're definitely not the cat for everyone.",
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
    beforeEach(() => {
        getBreedByIdUseCase = new getBreedByIdUseCase_1.GetBreedByIdUseCase(mockBreedRepository);
        jest.clearAllMocks();
    });
    it('should return a breed when found by ID', async () => {
        mockBreedRepository.findById.mockResolvedValue(mockBreed);
        const result = await getBreedByIdUseCase.execute(mockBreedId);
        expect(mockBreedRepository.findById).toHaveBeenCalledWith(mockBreedId);
        expect(result).toEqual(mockBreed);
    });
    it('should return null when breed is not found', async () => {
        mockBreedRepository.findById.mockResolvedValue(null);
        const result = await getBreedByIdUseCase.execute('nonexistent-id');
        expect(mockBreedRepository.findById).toHaveBeenCalledWith('nonexistent-id');
        expect(result).toBeNull();
    });
    it('should propagate errors from the repository', async () => {
        mockBreedRepository.findById.mockRejectedValue(new Error('Repository error'));
        await expect(getBreedByIdUseCase.execute(mockBreedId))
            .rejects.toThrow('Repository error');
        expect(mockBreedRepository.findById).toHaveBeenCalledWith(mockBreedId);
    });
});
