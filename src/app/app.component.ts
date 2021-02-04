import { Component, OnDestroy, OnInit } from '@angular/core';
import { empty, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserInterface } from './shared/interfaces/user.interface';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  public user: UserInterface;
  public isLoading: boolean;
  public hasError: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;

    this.userSubscription = this.authService.userDocument
      .pipe(
        tap((user) => {
          this.user = user;
          this.isLoading = false;
        }),
        catchError(() => {
          this.hasError = true;
          this.isLoading = false;
          return empty();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
