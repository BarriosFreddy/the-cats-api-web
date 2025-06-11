import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth-repository.interface';
import { AuthResponse, LoginCredentials } from '../../domain/entities/auth.entity';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService implements AuthRepository {
  private currentUserSubject = new BehaviorSubject<AuthResponse['user'] | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const token = localStorage.getItem('token');
        
        if (user && token) {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        } else {
          this.clearAuthData();
        }
      } catch (error) {
        console.error('Error parsing stored user', error);
        this.clearAuthData();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<void> {
    return this.http.post<{message: string}>(`${environment.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.clearAuthData()),
      map(() => void 0),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    const hasToken = !!localStorage.getItem('token');
    const currentState = this.isAuthenticatedSubject.value;
    if (hasToken !== currentState) {
      console.log('Updating authentication state to:', hasToken);
      this.isAuthenticatedSubject.next(hasToken);
    }
    
    return this.isAuthenticatedSubject.asObservable();
  }

  getCurrentUser(): Observable<AuthResponse['user'] | null> {
    return this.currentUserSubject.asObservable();
  }
  
  private clearAuthData(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}, Message: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
