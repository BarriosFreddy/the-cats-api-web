import { InjectionToken } from '@angular/core';
import { UserRepository } from './user-repository.interface';
import { AuthRepository } from './auth-repository.interface';
import { BreedRepository } from './breed-repository.interface';

export const USER_REPOSITORY = new InjectionToken<UserRepository>('UserRepository');
export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AuthRepository');
export const BREED_REPOSITORY = new InjectionToken<BreedRepository>('BreedRepository');
