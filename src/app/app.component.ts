import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserInterface } from './shared/interfaces/user.interface';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
    private routerEventsSubscription: Subscription;
    private userSubscription: Subscription;
    private contentLoadingSafelist = ['/auth'];
    public user: UserInterface;
    public isLoading: boolean;
    public isLoadingContent: boolean;
    public hasError: boolean;

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly userService: UserService,
    ) {
        this.routerEventsSubscription = this.router.events.subscribe((event) => {
            if (
                (event instanceof NavigationStart || event instanceof NavigationEnd) &&
                !this.contentLoadingSafelist.includes(event.url)
            ) {
                if (event instanceof NavigationStart) {
                    this.isLoadingContent = true;
                }

                if (event instanceof NavigationEnd && !this.isLoading) {
                    this.endContentLoading();
                }
            }
        });
    }

    ngOnInit() {
        this.isLoading = true;

        this.userSubscription = this.authService.userDocument
            .pipe(
                tap((user) => {
                    this.hasError = false;
                    this.user = user;
                    this.userService.defaultGameSettingsState = user?.defaultGameSettings;
                    this.endLoading();
                }),
                catchError((error) => {
                    this.hasError = true;

                    this.endLoading();

                    console.error(error);

                    return EMPTY;
                }),
            )
            .subscribe();
    }

    ngOnDestroy() {
        if (this.routerEventsSubscription) {
            this.routerEventsSubscription.unsubscribe();
        }

        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    private endLoading() {
        this.isLoading = false;
        this.endContentLoading();
    }

    private endContentLoading() {
        const timeout = 300;

        setTimeout(() => {
            this.isLoadingContent = false;
        }, timeout);
    }
}
