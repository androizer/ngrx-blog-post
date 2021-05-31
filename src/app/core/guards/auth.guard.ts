import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { AuthActions } from 'src/app/auth/auth-action.types';
import { loginSelector } from 'src/app/auth/auth.selector';
import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly store: Store,
    private readonly authService: AuthService
  ) {}
  canLoad(route: Route, segments: UrlSegment[]) {
    return this._accessAllowed();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._accessAllowed();
  }

  private _accessAllowed(): boolean | Observable<boolean> {
    return this.store.select(loginSelector).pipe(
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      concatMap((payload) => {
        if (!payload) {
          return this.authService.refreshToken().pipe(
            map((user) => {
              this.store.dispatch(AuthActions.saveUser({ user }));
              return true;
            }),
            catchError(async () => {
              this.store.dispatch(AuthActions.logout());
              return false;
            })
          );
        }
        return of(payload);
      })
    );
  }
}
