import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/tokens';

@Injectable({
  providedIn: 'root'
})
export class CreateUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private userRepository: UserRepository) {}
  
  execute(user: User): Observable<User> {
    return this.userRepository.create(user);
  }
}
