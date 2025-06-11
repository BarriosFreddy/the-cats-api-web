import { Container } from "inversify";
import UserRepositoryImpl from "../infrastructure/repositories/UserRepositoryImpl";
import CreateUser from "../application/use-cases/user/createUser";
import UserController from "../interfaces/rest/controllers/userController";
import LoginUser from "../application/use-cases/auth/loginUser";
import AuthController from "../interfaces/rest/controllers/authController";
import { ApiBreedRepository } from "../infrastructure/repositories/ApiBreedImpl";
import { BreedController } from "../interfaces/rest/controllers/breedController";
import { GetAllBreedsUseCase } from "../application/use-cases/breeds/getAllBreedsUseCase";
import { GetBreedByIdUseCase } from "../application/use-cases/breeds/getBreedByIdUseCase";
import { GetBreedImagesUseCase } from "../application/use-cases/breeds/getBreedImagesUseCase";
import { SearchBreedUseCase } from "../application/use-cases/breeds/searchBreedUseCase";

const container = new Container();

// Register repositories
container.bind<UserRepositoryImpl>("UserRepository").to(UserRepositoryImpl);
container.bind<ApiBreedRepository>("BreedRepository").to(ApiBreedRepository);

// Register user use cases
container.bind<CreateUser>("CreateUser").to(CreateUser);
// Auth use cases
container.bind<LoginUser>("LoginUser").to(LoginUser); 
//Breeds
container.bind<GetAllBreedsUseCase>("GetAllBreedsUseCase").to(GetAllBreedsUseCase);
container.bind<GetBreedByIdUseCase>("GetBreedByIdUseCase").to(GetBreedByIdUseCase); 
container.bind<GetBreedImagesUseCase>("GetBreedImagesUseCase").to(GetBreedImagesUseCase); 
container.bind<SearchBreedUseCase>("SearchBreedUseCase").to(SearchBreedUseCase); 

// Register controllers
container.bind<UserController>("UserController").to(UserController);
container.bind<BreedController>("BreedController").to(BreedController);
container.bind<AuthController>("AuthController").to(AuthController);


export default container;