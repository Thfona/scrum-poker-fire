import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GameInterface } from 'src/app/shared/interfaces/game.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GamesService } from 'src/app/shared/services/games.service';

@Component({
  selector: 'app-play-page',
  templateUrl: './play-game.page.html',
  styleUrls: ['./play-game.page.scss']
})
export class PlayGamePage implements OnInit, OnDestroy {
  private gameSubscription: Subscription;
  public userId: string;
  public gameId: string;
  public game: GameInterface;
  public isLoading: boolean;
  public hasError: boolean;

  constructor(private authService: AuthService, private gamesService: GamesService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;

    this.userId = this.authService.userId;
    this.gameId = this.route.snapshot.paramMap.get('gameId');

    this.gameSubscription = this.gamesService
      .getGame(this.gameId)
      .pipe(
        tap((game) => {
          this.hasError = false;
          this.game = game;

          if (!this.game || (this.game && this.game.ownerId !== this.userId && !this.game.session.isActive)) {
            throw new Error();
          }

          this.isLoading = false;
        }),
        catchError(() => {
          this.hasError = true;
          this.isLoading = false;
          return EMPTY;
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }
}
