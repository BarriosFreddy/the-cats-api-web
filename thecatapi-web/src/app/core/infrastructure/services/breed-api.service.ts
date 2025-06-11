import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BreedRepository } from '../../domain/repositories/breed-repository.interface';
import { Breed, BreedImage } from '../../domain/entities/breed.entity';

@Injectable({
  providedIn: 'root'
})
export class BreedApiService implements BreedRepository {
  private apiUrl = 'http://localhost:3000/breeds';
  private searchUrl = 'http://localhost:3000/breeds/search';

  constructor(private http: HttpClient) {}

  getAllBreeds(): Observable<Breed[]> {
    return this.http.get<Breed[]>(this.apiUrl);
  }

  getBreedById(breedId: string): Observable<Breed> {
    return this.http.get<Breed>(`${this.apiUrl}/${breedId}`);
  }

  getBreedImages(breedId: string, limit: number = 10): Observable<BreedImage[]> {
    return this.http.get<BreedImage[]>(`${this.apiUrl}/${breedId}/images`, {
      params: { limit: limit.toString() }
    });
  }
  
  searchBreeds(query: string): Observable<Breed[]> {
    return this.http.get<Breed[]>(this.searchUrl, {
      params: { q: query }
    });
  }
}
