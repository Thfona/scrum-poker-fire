import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(_, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> {
    const routeAfterSignIn = routerStateSnapshot.url;

    return this.authService.userDocument.pipe(
      take(1),
      map((user) => !!user),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.authService.routeAfterSignIn = routeAfterSignIn;

          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
