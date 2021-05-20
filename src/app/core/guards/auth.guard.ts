import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {loginSelector} from 'src/app/auth/auth.selector';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private readonly store: Store) {}
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.store.select(loginSelector);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(loginSelector);
  }
}
