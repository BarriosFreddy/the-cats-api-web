import { Provider } from '@angular/core';
import { AUTH_REPOSITORY, BREED_REPOSITORY, USER_REPOSITORY } from '../../domain/repositories/tokens';
import { UserApiService } from '../services/user-api.service';
import { AuthApiService } from '../services/auth-api.service';
import { BreedApiService } from '../services/breed-api.service';

export const repositoryProviders: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserApiService },
  { provide: AUTH_REPOSITORY, useClass: AuthApiService },
  { provide: BREED_REPOSITORY, useClass: BreedApiService }
];
