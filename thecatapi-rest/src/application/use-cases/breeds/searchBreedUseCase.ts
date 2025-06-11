import { inject, injectable } from "inversify";
import { BreedRepository } from "../../../domain/repositories/BreedRepository";

@injectable()
export class SearchBreedUseCase {
    private breedRepository: BreedRepository;
    constructor(@inject("BreedRepository") breedRepository: BreedRepository) {
        this.breedRepository = breedRepository;
    }

    async execute(searchTerm: string) {
        return this.breedRepository.searchBreed(searchTerm);
    }
};
