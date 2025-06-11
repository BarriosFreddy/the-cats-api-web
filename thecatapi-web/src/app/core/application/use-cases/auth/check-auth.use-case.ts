import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../../domain/repositories/auth-repository.interface';
import { AUTH_REPOSITORY } from '../../../domain/repositories/tokens';

@Injectable({
  providedIn: 'root'
})
export class CheckAuthUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private authRepository: AuthRepository) {}
  
  execute(): Observable<boolean> {
    return this.authRepository.isAuthenticated();
  }
}
