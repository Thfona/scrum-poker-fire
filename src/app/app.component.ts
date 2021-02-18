import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { UserInterface } from './shared/interfaces/user.interface';
import { AuthService } from './shared/services/auth.service';
import { DomainService } from './shared/services/domain.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private routerEventsSubscription: Subscription;
  private dataSubscription: Subscription;
  private contentLoadingWhitelist = ['/auth'];
  public user: UserInterface;
  public isLoading: boolean;
  public isLoadingContent: boolean;
  public hasError: boolean;

  constructor(private authService: AuthService, private domainService: DomainService, private router: Router) {
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

    this.dataSubscription = this.authService.userDocument
      .pipe(
        map((user) => {
          this.user = user;
        }),
        concatMap(() => this.domainService.getDomainItems()),
        tap((domain) => {
          this.hasError = false;
          this.domainService.setDomain(domain);
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

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private endLoading() {
    this.isLoading = false;
    this.endContentLoading();
  }

  private endContentLoading() {
    const TIMEOUT = 300;

    setTimeout(() => {
      this.isLoadingContent = false;
    }, TIMEOUT);
  }
}
