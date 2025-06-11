import { BreedRepository } from "../../../domain/repositories/BreedRepository";
import { Breed } from "../../../domain/entities/Breed";
import { inject, injectable } from "inversify";

@injectable()
export class GetAllBreedsUseCase {
  private breedRepository: BreedRepository;
  constructor(@inject("BreedRepository") breedRepository: BreedRepository) {
    this.breedRepository = breedRepository;
  }

  async execute(): Promise<Breed[]> {
    return this.breedRepository.findAll();
  }
}
