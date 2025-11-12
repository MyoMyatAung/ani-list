import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('Is Authenticated:', authService.isAuthenticated());
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to sign-in page with return url
  router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });
  return false;
};
