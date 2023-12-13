import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../app/services/auth/auth.service';

export const userGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};
