import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BreedImage } from '../../../domain/entities/breed.entity';
import { BreedRepository } from '../../../domain/repositories/breed-repository.interface';
import { BREED_REPOSITORY } from '../../../domain/repositories/tokens';

@Injectable({
  providedIn: 'root'
})
export class GetBreedImagesUseCase {
  constructor(@Inject(BREED_REPOSITORY) private breedRepository: BreedRepository) {}
  
  execute(breedId: string, limit: number = 10): Observable<BreedImage[]> {
    return this.breedRepository.getBreedImages(breedId, limit);
  }
}
