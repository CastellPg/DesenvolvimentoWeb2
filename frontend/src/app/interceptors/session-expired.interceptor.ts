import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthSessionService } from '../services/auth-session.service';

function isBackendRequest(url: string): boolean {
  return url.startsWith('http://localhost:8080');
}

function isLoginRequest(url: string): boolean {
  return url.endsWith('/login');
}

export const sessionExpiredInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const router = inject(Router);
  const authSessionService = inject(AuthSessionService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        isBackendRequest(req.url) &&
        !isLoginRequest(req.url)
      ) {
        authSessionService.limparSessaoLocal();
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
