import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  private canAccess(routeAfterSignIn: string) {
    return this.authService.userDocument.pipe(
      take(1),
      map((user) => !!user),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.authService.routeAfterSignIn = routeAfterSignIn;

          this.router.navigate(['/auth']);
        }
      }),
    );
  }

  canActivate(_: Route, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> {
    return this.canAccess(routerStateSnapshot.url);
  }

  canLoad(_: Route, segments: UrlSegment[]): Observable<boolean> {
    const url = segments.reduce((path, currentSegment) => {
      return `${path}/${currentSegment.path}`;
    }, '');

    return this.canAccess(url);
  }
}
