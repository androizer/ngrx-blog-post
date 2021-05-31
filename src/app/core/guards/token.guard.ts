import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  first,
  map,
  mergeMap,
} from 'rxjs/operators';

import { AuthActions } from '../../auth/redux/auth.actions';
import { AuthSelectors } from '../../auth/redux/auth.selectors';

@Injectable()
export class TokenGuard implements CanLoad {
  constructor(private readonly store: Store) {}
  canLoad():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.store.select(AuthSelectors.accessToken).pipe(
      first(),
      mergeMap((token) => {
        if (!token) {
          return of(
            this.store.dispatch(AuthActions.refreshTokenRequestedByGuard())
          ).pipe(
            concatMap(() =>
              this.store.select(AuthSelectors.accessToken).pipe(
                filter((token) => !!token),
                first()
              )
            ),
            map(() => true),
            catchError(() => of(false))
          );
        } else {
          return of(true);
        }
      })
    );
  }
}
