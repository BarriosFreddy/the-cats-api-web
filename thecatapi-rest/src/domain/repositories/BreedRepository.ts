import { Breed, BreedImage } from "../entities/Breed";

export interface BreedRepository {
  findAll(): Promise<Breed[]>;
  findById(id: string): Promise<Breed | null>;
  findImagesByBreedId(breedId: string, limit?: number): Promise<BreedImage[]>;
  searchBreed(searchTerm: string): Promise<Breed[]>;
}
