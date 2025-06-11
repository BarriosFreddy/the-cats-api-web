import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap, catchError, of } from 'rxjs';
import { CheckAuthUseCase } from '../../application/use-cases/auth/check-auth.use-case';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const checkAuthUseCase = inject(CheckAuthUseCase);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  
  console.log('Auth guard activated for path:', state.url);
  
  const hasToken = !!localStorage.getItem('token');
  const hasUser = !!localStorage.getItem('currentUser');
  console.log('Auth guard token check:', hasToken, 'User check:', hasUser);
  
  if (hasToken && hasUser) {
    console.log('Local auth data available, allowing access');
    return true;
  }
  
  return checkAuthUseCase.execute().pipe(
    map(isAuthenticated => {
      const currentHasToken = !!localStorage.getItem('token');
      
      if (!isAuthenticated && currentHasToken) {
        console.log('Conflict between token presence and auth state, trusting token');
        return true;
      }
      
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        notificationService.warning('Por favor inicia sesión para acceder a esta página');
        router.navigate(['/login'], { replaceUrl: true });
        return false;
      }
      
      return true;
    }),
    catchError(error => {
      console.error('Auth guard error:', error);
      notificationService.error('Error de autenticación. Por favor inicia sesión nuevamente.');
      router.navigate(['/login'], { replaceUrl: true });
      return of(false);
    })
  );
};
