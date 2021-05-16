import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, concatMap, filter, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../../core/services';

export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  readonly tokenBSubject = new BehaviorSubject<string>(null);
  isTokenRefreshing = false;

  get isTokenExpired() {
    return this.authService.isTokenExpired();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(this.attachToken(req)).pipe(
      catchError((err) => {
        if (
          err instanceof HttpErrorResponse &&
          err.status === 401 &&
          this.isTokenExpired
        ) {
          return this.handleRefreshToken(req, next);
        }
        return throwError(err);
      })
    );
  }

  attachToken(req: HttpRequest<any>) {
    const accessToken = this.authService.getAccessToken();
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
    return req;
  }

  handleRefreshToken(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.tokenBSubject.next(null);

      return this.authService.refreshToken().pipe(
        concatMap((payload) => {
          this.isTokenRefreshing = false;
          this.tokenBSubject.next(payload.accessToken);
          return next.handle(this.attachToken(req));
        })
      );
    } else {
      return this.tokenBSubject.pipe(
        filter((token) => !!token),
        take(1),
        switchMap(() => next.handle(this.attachToken(req)))
      );
    }
  }
}
