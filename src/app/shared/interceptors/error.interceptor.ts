import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { SessionService } from '../services/session.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  readonly exceptions: { path: string; codeError?: number }[] = [{ path: '/login', codeError: 404 }];

  constructor(private sessionService: SessionService) {}

  public async handleError(err: HttpErrorResponse) {
    const accessToken = this.sessionService.accessToken;

    if (accessToken && err.status === 401) {
      // TODO: Change message
      alert('SESSION_EXPIRED');
      this.sessionService.logout();
    }
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            this.handleError(err);
          }
        }
      )
    );
  }
}
