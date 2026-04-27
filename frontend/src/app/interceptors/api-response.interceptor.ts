import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

function isApiResponse<T = unknown>(body: unknown): body is ApiResponse<T> {
  return !!body
    && typeof body === 'object'
    && 'status' in body
    && 'message' in body
    && 'data' in body;
}

export const apiResponseInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  return next(req).pipe(
    map((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse && isApiResponse(event.body)) {
        return event.clone({ body: event.body.data });
      }

      return event;
    }),
  );
};