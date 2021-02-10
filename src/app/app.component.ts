import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserInterface } from './shared/interfaces/user.interface';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private routerEventsSubscription: Subscription;
  private userSubscription: Subscription;
  private contentLoadingWhitelist = ['/auth'];
  public user: UserInterface;
  public isLoading: boolean;
  public isLoadingContent: boolean;
  public hasError: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (
        (event instanceof NavigationStart || event instanceof NavigationEnd) &&
        !this.contentLoadingWhitelist.includes(event.url)
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
          this.endLoading();
        }),
        catchError(() => {
          this.hasError = true;
          this.endLoading();
          return EMPTY;
        })
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
    const timeout = 200;

    setTimeout(() => {
      this.isLoading = false;
      this.endContentLoading(timeout);
    }, timeout);
  }

  private endContentLoading(additionalTimeout = 0) {
    const timeout = 400 + additionalTimeout;

    setTimeout(() => {
      this.isLoadingContent = false;
    }, timeout);
  }
}
