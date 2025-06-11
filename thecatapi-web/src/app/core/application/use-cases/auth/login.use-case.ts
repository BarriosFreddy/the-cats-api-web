import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, LoginCredentials } from '../../../domain/entities/auth.entity';
import { AuthRepository } from '../../../domain/repositories/auth-repository.interface';
import { AUTH_REPOSITORY } from '../../../domain/repositories/tokens';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private authRepository: AuthRepository) {}
  
  execute(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.authRepository.login(credentials);
  }
}
