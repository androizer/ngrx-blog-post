import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../auth/models';

interface TokensPayload {
  accessToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  private accessToken: string | null = null;
  private currentUser!: User;

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
          this._saveTokensAndRescheduleRefresh(payload);
          return this.whoAmI();
        })
      );
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/auth/logout`).pipe(
      tap(() => {
        this.accessToken = null;
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
          this._saveTokensAndRescheduleRefresh(payload);
          return this.whoAmI();
        }),
        catchError((err) => {
          this.router.navigate(['/auth/login']);
          return throwError(err);
        })
      );
  }

  whoAmI() {
    return this.http
      .get<User>(`${environment.apiUrl}/auth/me`)
      .pipe(tap((payload) => (this.currentUser = payload)));
  }

  getAccessToken() {
    return this.accessToken;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  private _saveTokensAndRescheduleRefresh(payload: TokensPayload) {
    // Soon this will shift to ngrx/store.
    this.accessToken = payload.accessToken;
    const durationDiff = payload.expiresIn - Date.now();
    setTimeout(() => {
      this.refreshToken();
    }, durationDiff - 1000);
  }
}
