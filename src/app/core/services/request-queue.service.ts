import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

/**
 * Will plan to use it later for better for request management.
 */
@Injectable()
export class RequestQueueService implements HttpInterceptor {
  readonly tokenBSubject = new BehaviorSubject<string>(null);
  isTokenRefreshing = false;
  private queue: ReplaySubject<any>[] = [];

  constructor(private readonly authService: AuthService) {
    this.tokenBSubject.asObservable().subscribe((jwt) => {
      if (jwt) {
        this.queue.forEach((sub$) => this.dispatchRequest(sub$));
      }
      this.queue.length = 0;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const queueItem$ = new ReplaySubject();
    const request$ = queueItem$.pipe(
      switchMap(() => next.handle(this.attachToken(req)))
    );
    this.queue.push(queueItem$);
    return request$;
  }

  dispatchRequest(nextSub$: ReplaySubject<any>) {
    nextSub$.next();
    nextSub$.complete();
  }

  attachToken(req: HttpRequest<any>) {
    // const accessToken = this.authService.getAccessToken();
    const accessToken = '';
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
    return req;
  }
}
