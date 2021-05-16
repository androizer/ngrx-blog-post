import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CreateQueryParams, RequestQueryBuilder } from '@nestjsx/crud-request';
import { iif, of, throwError } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../auth/models';

interface TokensPayload {
  accessToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  private accessToken: string;
  private currentUser: User;
  private tokenExpiresIn: number;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  register(user: FormData) {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user);
  }

  login(email: string, password: string) {
    return this.http
      .post<TokensPayload>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        concatMap((payload) => {
          // TODO: check from store if current user details are present or not.
          this._saveTokenAndExpireDuration(payload);
          return iif(
            () => !!this.currentUser,
            of(payload),
            this.whoAmI().pipe(map(() => payload))
          );
        })
      );
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/auth/logout`).pipe(
      tap(() => {
        this.accessToken = null;
        this.tokenExpiresIn = null;
        this.currentUser = null;
      })
    );
  }

  refreshToken() {
    return this.http
      .get<TokensPayload>(`${environment.apiUrl}/auth/token/refresh`, {
        withCredentials: true,
      })
      .pipe(
        concatMap((payload) => {
          // TODO: check from store if current user details are present or not.
          this._saveTokenAndExpireDuration(payload);
          return iif(
            () => !!this.currentUser,
            of(payload),
            this.whoAmI().pipe(map(() => payload))
          );
        }),
        catchError((err) => {
          this.router.navigate(['/auth/login']);
          return throwError(err);
        })
      );
  }

  whoAmI(query: CreateQueryParams = { join: { field: 'avatar' } }) {
    const qb = RequestQueryBuilder.create(query).query();
    return this.http
      .get<User>(`${environment.apiUrl}/auth/me`, {
        params: new HttpParams({ fromString: qb }),
      })
      .pipe(tap((payload) => (this.currentUser = new User(payload))));
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  isTokenExpired(): boolean {
    return Date.now() > this.tokenExpiresIn;
  }

  private _saveTokenAndExpireDuration(payload: TokensPayload) {
    // Soon this will shift to ngrx/store.
    this.accessToken = payload.accessToken;
    this.tokenExpiresIn = payload.expiresIn;
  }
}
