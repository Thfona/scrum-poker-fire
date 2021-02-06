import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { empty, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserInterface } from './shared/interfaces/user.interface';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private routerSubscription: Subscription;
  private userSubscription: Subscription;
  public user: UserInterface;
  public isLoading: boolean;
  public isLoadingContent: boolean;
  public hasError: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.isLoadingContent = true;
      }

      if (val instanceof NavigationEnd && !this.isLoading) {
        this.endContentLoading();
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;

    this.userSubscription = this.authService.userDocument
      .pipe(
        tap((user) => {
          this.user = user;
          this.endLoading();
        }),
        catchError(() => {
          this.hasError = true;
          this.endLoading();
          return empty();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
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
    const timeout = 500 + additionalTimeout;

    setTimeout(() => {
      this.isLoadingContent = false;
    }, timeout);
  }
}
