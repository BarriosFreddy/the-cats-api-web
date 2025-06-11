import { Request, Response } from 'express';
import { GetAllBreedsUseCase } from '../../../application/use-cases/breeds/getAllBreedsUseCase';
import { GetBreedByIdUseCase } from '../../../application/use-cases/breeds/getBreedByIdUseCase';
import { GetBreedImagesUseCase } from '../../../application/use-cases/breeds/getBreedImagesUseCase';
import { SearchBreedUseCase } from '../../../application/use-cases/breeds/searchBreedUseCase';
import { inject, injectable } from 'inversify';

@injectable()
export class BreedController {
  private getAllBreedsUseCase: GetAllBreedsUseCase;
  private getBreedByIdUseCase: GetBreedByIdUseCase;
  private getBreedImagesUseCase: GetBreedImagesUseCase;
  private searchBreedUseCase: SearchBreedUseCase;

  constructor(
    @inject("GetAllBreedsUseCase") getAllBreedsUseCase: GetAllBreedsUseCase,
    @inject("GetBreedByIdUseCase") getBreedByIdUseCase: GetBreedByIdUseCase,
    @inject("GetBreedImagesUseCase") getBreedImagesUseCase: GetBreedImagesUseCase,
    @inject("SearchBreedUseCase") searchBreedUseCase: SearchBreedUseCase
  ) {
    this.getAllBreedsUseCase = getAllBreedsUseCase
    this.getBreedByIdUseCase = getBreedByIdUseCase
    this.getBreedImagesUseCase = getBreedImagesUseCase
    this.searchBreedUseCase = searchBreedUseCase

    this.getAllBreeds = this.getAllBreeds.bind(this)
    this.getBreedById = this.getBreedById.bind(this)
    this.getBreedImages = this.getBreedImages.bind(this)
    this.findBreed = this.findBreed.bind(this)

  }
  async getAllBreeds(req: Request, res: Response): Promise<void> {
    try {
      const breeds = await this.getAllBreedsUseCase.execute();
      res.status(200).json(breeds);
    } catch (error) {
      console.error('Error getting all breeds:', error);
      res.status(500).json({ message: 'Error fetching breeds' });
    }
  }

  async getBreedById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const breed = await this.getBreedByIdUseCase.execute(id);

      if (!breed) {
        res.status(404).json({ message: `Breed with id ${id} not found` });
        return;
      }

      res.status(200).json(breed);
    } catch (error) {
      console.error('Error getting breed by id:', error);
      res.status(500).json({ message: 'Error fetching breed' });
    }
  }

  async findBreed(req: Request, res: Response) {
    try {
      const { q } = req.query as unknown as { q: string }
      const breeds = await this.searchBreedUseCase.execute(q);
      res.status(200).json(breeds);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }

  async getBreedImages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const images = await this.getBreedImagesUseCase.execute(id, limit);
      res.status(200).json(images);
    } catch (error) {
      console.error('Error getting breed images:', error);
      res.status(500).json({ message: 'Error fetching breed images' });
    }
  }
}
