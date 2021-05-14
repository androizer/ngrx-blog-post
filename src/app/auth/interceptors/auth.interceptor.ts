import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services';

export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    if (!req.headers.get('Authorization')) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });
    }
    return next.handle(req);
  }
}
