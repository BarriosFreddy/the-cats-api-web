import { BreedRepository } from "../../../domain/repositories/BreedRepository";
import { Breed } from "../../../domain/entities/Breed";
import { inject, injectable } from "inversify";

@injectable()
export class GetBreedByIdUseCase {
  private breedRepository: BreedRepository;
  constructor(@inject("BreedRepository") breedRepository: BreedRepository) {
    this.breedRepository = breedRepository;
  }

  async execute(id: string): Promise<Breed | null> {
    return this.breedRepository.findById(id);
  }
}
