import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SessionService } from '../services/session.service';
import { environment } from 'src/environments/environment';
import { endpoints } from '../constants/endpoints.constant';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private sessionService: SessionService) {}

  private whiteList: string[] = [endpoints.refreshAccessToken.url];

  private apiBaseUrl: string = environment.apiBaseUrl;

  intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    if (this.whiteList.includes(request.url) || !request.url.includes(this.apiBaseUrl)) {
      return handler.handle(request);
    }

    return this.sessionService.refreshAccessToken().pipe(
      switchMap((response: string) => {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${response}`
          }
        });

        return handler.handle(request);
      })
    );
  }
}
