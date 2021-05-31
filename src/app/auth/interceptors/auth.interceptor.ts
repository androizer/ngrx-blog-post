import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  first,
  mergeMap,
  switchMap,
  take,
} from 'rxjs/operators';

import { AuthActions } from '../redux/auth.actions';
import { AuthSelectors } from '../redux/auth.selectors';

export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) {}

  readonly tokenBSubject = new BehaviorSubject<string>(null);
  isTokenRefreshing = false;

  isTokenExpired(expiresIn: number) {
    if (typeof expiresIn === 'number') {
      return Date.now() > expiresIn;
    }
    return false;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.attachToken$(req, next).pipe(
      first(),
      concatMap((reqWithToken) => next.handle(reqWithToken)),
      catchError((err) => {
        return this.store.select(AuthSelectors.expiresIn).pipe(
          mergeMap((expiresIn) => {
            if (
              err instanceof HttpErrorResponse &&
              err.status === 401 &&
              this.isTokenExpired(expiresIn)
            ) {
              return this.handleRefreshToken(req, next);
            }
            return throwError(err);
          })
        );
      })
    );
  }

  attachToken$(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select(AuthSelectors.accessToken).pipe(
      first(),
      mergeMap((token) => {
        if (token) {
          req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          });
        }
        return of(req);
      })
    );
  }

  handleRefreshToken(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.tokenBSubject.next(null);
      // * make sure to clear existing accessToken and expiresIn
      // * so that it doesn't reuse the same old token
      return of(
        this.store.dispatch(AuthActions.refreshTokenRequestedByInterceptor())
      ).pipe(
        concatMap(() =>
          this.store.select(AuthSelectors.accessToken).pipe(
            filter((token) => !!token),
            first(),
            concatMap((token) => {
              this.isTokenRefreshing = false;
              this.tokenBSubject.next(token);
              return this.attachToken$(req, next).pipe(
                first(),
                mergeMap((reqWithToken) => next.handle(reqWithToken))
              );
            })
          )
        )
      );
    } else {
      return this.tokenBSubject.pipe(
        filter((token) => !!token),
        take(1),
        switchMap(() =>
          this.attachToken$(req, next).pipe(
            first(),
            mergeMap((reqWithToken) => next.handle(reqWithToken))
          )
        )
      );
    }
  }
}
