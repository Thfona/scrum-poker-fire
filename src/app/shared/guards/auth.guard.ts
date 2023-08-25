import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

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

  public canActivate(): Observable<boolean> {
    return this.canAccess();
  }

  public canLoad(): Observable<boolean> {
    return this.canAccess();
  }
}
