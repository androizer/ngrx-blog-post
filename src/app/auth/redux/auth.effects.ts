import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError, concatMap, map, mergeMap, tap } from 'rxjs/operators';
import { CommentActions, PostActions } from '../../blogs/redux/actions';

import { AuthService } from '../../core/services';
import { uuid } from '../../core/types';
import { AuthActions } from './auth.actions';
import { AuthSelectors } from './auth.selectors';

@Injectable()
export class AuthEffects {
  constructor(
    private readonly action$: Actions,
    private readonly store: Store,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly matSnackbar: MatSnackBar
  ) {}

  login$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.loginRequested),
      concatMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          mergeMap((payload) => {
            return [
              AuthActions.loginSucceed({ ...payload }),
              AuthActions.currentUserRequested(),
            ];
          }),
          catchError(async () => {
            this.matSnackbar.open('Login Failed!', 'OK');
            return AuthActions.loginFailed();
          })
        )
      ),
      tap(() => this.router.navigate(['blogs']))
    )
  );

  logout$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.logoutRequested),
      concatMap(() =>
        this.authService.logout().pipe(
          tap(() => this.router.navigate(['/auth/login'])),
          concatMap(() => [
            AuthActions.logoutSucceed(),
            PostActions.resetAll(),
            CommentActions.resetAll(),
          ])
        )
      )
    )
  );

  registration$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(AuthActions.registration),
        concatMap(({ user }) =>
          this.authService.register(user).pipe(
            tap(() => {
              this.matSnackbar.open('Registration Successful!', 'OK');
              this.router.navigate(['/auth/login']);
            }),
            catchError((err) => {
              this.matSnackbar.open(err.message, 'OK');
              return throwError(err);
            })
          )
        )
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.action$.pipe(
      ofType(
        AuthActions.refreshTokenRequestedByGuard,
        AuthActions.refreshTokenRequestedByInterceptor
      ),
      concatMap(() =>
        this.authService
          .refreshToken()
          .pipe(
            concatMap(({ accessToken, expiresIn }) => [
              AuthActions.refreshTokenSucceed({ accessToken, expiresIn }),
              AuthActions.currentUserRequested(),
            ])
          )
      )
    )
  );

  storeCurrentUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.currentUserRequested),
      concatMap(() => {
        return this.authService
          .whoAmI()
          .pipe(map((user) => AuthActions.storeCurrentUser({ user })));
      })
    )
  );

  toggleBookmark$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.toggleBookmark),
      concatLatestFrom(() => this.store.select(AuthSelectors.currentUser)),
      map(([{ bookmarkId, isRemoved }, user]) => {
        let bookmarkIds: uuid[];
        const isBookmarked = isRemoved ? false : true;
        // If the user just bookmarked the post, then add
        // the bookmarkId to user's bookmarkIds array
        if (isBookmarked) {
          bookmarkIds = [...user.bookmarkIds, bookmarkId];
        }
        // Else remove the bookmarkId from user's bookmarkIds
        // (if he just un-bookmarked it).
        else {
          const index = user.bookmarkIds.findIndex((id) => id === bookmarkId);
          if (index >= 0) {
            bookmarkIds = [...user.bookmarkIds];
            bookmarkIds.splice(index, 1);
          }
        }
        return AuthActions.updateCurrentUser({
          user: { id: user.id, bookmarkIds },
        });
      })
    )
  );
}
