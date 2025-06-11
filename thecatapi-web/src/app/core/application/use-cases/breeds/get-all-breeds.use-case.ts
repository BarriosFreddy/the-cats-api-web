import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Breed } from '../../../domain/entities/breed.entity';
import { BreedRepository } from '../../../domain/repositories/breed-repository.interface';
import { BREED_REPOSITORY } from '../../../domain/repositories/tokens';

@Injectable({
  providedIn: 'root'
})
export class GetAllBreedsUseCase {
  constructor(@Inject(BREED_REPOSITORY) private breedRepository: BreedRepository) {}
  
  execute(): Observable<Breed[]> {
    return this.breedRepository.getAllBreeds();
  }
}
