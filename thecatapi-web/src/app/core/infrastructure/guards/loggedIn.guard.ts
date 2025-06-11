import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedInGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);

  console.log('Auth guard activated for path:', state.url);

  const hasToken = !!localStorage.getItem('token');
  const hasUser = !!localStorage.getItem('currentUser');

  if (hasToken && hasUser) {
    router.navigate(['/home'], { replaceUrl: true });
    return false;
  }
  return true;
};
