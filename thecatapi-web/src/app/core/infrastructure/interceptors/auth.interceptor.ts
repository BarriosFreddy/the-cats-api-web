import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthApiService } from '../services/auth-api.service';
import { catchError, switchMap, take, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthApiService);
  
  // Skip interceptor for login and register requests
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }
  
  // Get the stored token
  const token = localStorage.getItem('token');
  
  if (token) {
    // Clone the request and add the authorization header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    // Send the request with the token
    return next(authReq);
  }
  
  return next(req);
};
