import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../core/services';

import { AuthActions } from './auth-action.types';

const USER_KEY = 'user';
const PASSWORD_KEY = 'pwd';

@Injectable()
export class AuthEffects {
  login$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(AuthActions.login),
        concatMap(({ email, password }) => {
          return this.authService.login(email, password).pipe(
            map((user) => {
              return AuthActions.saveUser({ user, routeToBlogs: true });
            }),
            catchError(async () => {
              this.matSnackbar.open('Login Failed!', 'OK');
              return AuthActions.loginFail();
            })
          );
        })
      );
    },
  );

  saveUser$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(AuthActions.saveUser),
        tap(({ user, routeToBlogs }) => {
          if (routeToBlogs) {
            setTimeout(() => {
              this.router.navigate(['blogs']);
            }, 1000);
          }
        })
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem(PASSWORD_KEY);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly action$: Actions,
    private readonly authService: AuthService,
    private readonly matSnackbar: MatSnackBar,
    private readonly router: Router
  ) {}
}
