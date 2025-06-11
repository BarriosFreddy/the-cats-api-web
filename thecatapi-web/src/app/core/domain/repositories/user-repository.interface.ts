import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

export interface UserRepository {
  findAll(): Observable<User[]>;
  findById(id: string): Observable<User>;
  create(user: User): Observable<User>;
  update(id: string, user: Partial<User>): Observable<User>;
  delete(id: string): Observable<void>;
}
