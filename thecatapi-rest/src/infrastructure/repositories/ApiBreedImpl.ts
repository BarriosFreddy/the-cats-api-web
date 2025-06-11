import axios from 'axios';
import { Breed, BreedImage } from '../../domain/entities/Breed';
import { BreedRepository } from '../../domain/repositories/BreedRepository';
import { CAT_API_KEY, CAT_API_URL } from '../../config/EnvVariables';

export class ApiBreedRepository implements BreedRepository {

  private getHeaders() {
    return {
      'x-api-key': CAT_API_KEY
    };
  }

  async findAll(): Promise<Breed[]> {
    try {
      const response = await axios.get<Breed[]>(`${CAT_API_URL}/breeds`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching breeds:', error);
      return [];
    }
  }

  async findById(id: string): Promise<Breed | null> {
    try {
      const response = await axios.get<Breed>(`${CAT_API_URL}/breeds/${id}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching breed with id ${id}:`, error);
      return null;
    }
  }

  async findImagesByBreedId(breedId: string, limit: number = 10): Promise<BreedImage[]> {
    try {
      const response = await axios.get<BreedImage[]>(`${CAT_API_URL}/images/search`, {
        headers: this.getHeaders(),
        params: {
          breed_ids: breedId,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for breed ${breedId}:`, error);
      return [];
    }
  }

  async searchBreed(searchTerm: string): Promise<Breed[]> {
    try {
      const response = await axios.get<Breed[]>(`${CAT_API_URL}/breeds/search?q=${searchTerm}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching breeds `, error);
      return [];
    }
  }

}
