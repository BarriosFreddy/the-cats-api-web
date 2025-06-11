import { BreedRepository } from "../../../domain/repositories/BreedRepository";
import { BreedImage } from "../../../domain/entities/Breed";
import { inject, injectable } from "inversify";

@injectable()
export class GetBreedImagesUseCase {
  private breedRepository: BreedRepository;
  constructor(@inject("BreedRepository") breedRepository: BreedRepository) {
    this.breedRepository = breedRepository;
  }

  async execute(breedId: string, limit: number = 10): Promise<BreedImage[]> {
    return this.breedRepository.findImagesByBreedId(breedId, limit);
  }
}
