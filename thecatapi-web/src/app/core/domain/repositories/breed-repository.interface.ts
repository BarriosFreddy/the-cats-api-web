import { Observable } from 'rxjs';
import { Breed, BreedImage } from '../entities/breed.entity';

export interface BreedRepository {
  getAllBreeds(): Observable<Breed[]>;
  getBreedById(breedId: string): Observable<Breed>;
  getBreedImages(breedId: string, limit?: number): Observable<BreedImage[]>;
  searchBreeds(query: string): Observable<Breed[]>;
}
