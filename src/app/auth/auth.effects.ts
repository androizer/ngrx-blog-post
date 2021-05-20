import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { AuthActions } from './auth-action.types';

const USER_KEY = 'user';
const PASSWORD_KEY = 'pwd';

@Injectable()
export class AuthEffects {
  login$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(AuthActions.login),
        tap((action) => {
          localStorage.setItem(USER_KEY, action.user.email);
          localStorage.setItem(PASSWORD_KEY, action.user.password);
        })
      );
    },
    {
      dispatch: false,
    }
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
  constructor(private readonly action$: Actions) {}
}
