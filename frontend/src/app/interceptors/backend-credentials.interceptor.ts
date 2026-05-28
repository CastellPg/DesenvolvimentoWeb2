import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

function isBackendRequest(url: string): boolean {
  return url.startsWith('http://localhost:8080');
}

export const backendCredentialsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (!isBackendRequest(req.url) || req.withCredentials) {
    return next(req);
  }

  return next(req.clone({ withCredentials: true }));
};

