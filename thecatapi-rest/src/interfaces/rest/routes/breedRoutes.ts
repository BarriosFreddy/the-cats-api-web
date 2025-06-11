import express, { RequestHandler, Router } from 'express';
import { BreedController } from '../controllers/breedController';
import container from '../../../config/Container';

const breedController: BreedController = container.get<BreedController>("BreedController");

const breedRouter: Router = express.Router();

breedRouter.get('/', breedController.getAllBreeds as RequestHandler);
breedRouter.get("/search", breedController.findBreed as RequestHandler);
breedRouter.get('/:id', breedController.getBreedById as RequestHandler);
breedRouter.get('/:id/images', breedController.getBreedImages as RequestHandler);

export { breedRouter };
