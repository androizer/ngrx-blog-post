import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../services';

@Injectable()
export class TokenGuard implements CanLoad {
  constructor(private readonly authService: AuthService) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const accessToken = this.authService.getAccessToken();
    if (!accessToken) {
      return this.authService.refreshToken().pipe(
        map(() => true),
        catchError(() => of(false))
      );
    }
    return true;
  }
}
