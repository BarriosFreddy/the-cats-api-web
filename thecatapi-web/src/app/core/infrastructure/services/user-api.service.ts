import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class UserApiService implements UserRepository {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  findById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
