import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CreateQueryParams, RequestQueryBuilder } from '@nestjsx/crud-request';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../../auth/models';

interface TokensPayload {
  accessToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  register(user: FormData) {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user);
  }

  login(email: string, password: string) {
    return this.http.post<TokensPayload>(`${environment.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/auth/logout`);
  }

  refreshToken() {
    return this.http
      .get<TokensPayload>(`${environment.apiUrl}/auth/token/refresh`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          this.router.navigate(['/auth/login']);
          return throwError(err);
        })
      );
  }

  whoAmI(query: CreateQueryParams = { join: { field: 'avatar' } }) {
    const qb = RequestQueryBuilder.create(query).query();
    return this.http.get<User>(`${environment.apiUrl}/auth/me`, {
      params: new HttpParams({ fromString: qb }),
    });
  }
}
