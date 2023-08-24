import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  private canAccess(): Observable<boolean> {
    return this.authService.userDocument.pipe(
      take(1),
      map((user) => !user),
      tap((notLoggedIn) => {
        if (!notLoggedIn) {
          this.router.navigate(['/home']);
        }
      }),
    );
  }

  canActivate(): Observable<boolean> {
    return this.canAccess();
  }

  canLoad(): Observable<boolean> {
    return this.canAccess();
  }
}
