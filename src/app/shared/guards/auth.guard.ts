import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
class AuthGuard {
    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
    ) {}

    public canAccess(): Observable<boolean> {
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
}

export const authGuard = () => inject(AuthGuard).canAccess();
