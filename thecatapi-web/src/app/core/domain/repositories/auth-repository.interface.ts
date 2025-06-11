import { Observable } from 'rxjs';
import { AuthResponse, LoginCredentials } from '../entities/auth.entity';

export interface AuthRepository {
  login(credentials: LoginCredentials): Observable<AuthResponse>;
  logout(): Observable<void>;
  isAuthenticated(): Observable<boolean>;
  getCurrentUser(): Observable<AuthResponse['user'] | null>;
}
