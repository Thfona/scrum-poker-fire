import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GameSessionUserInterface } from 'src/app/shared/interfaces/game-session-user.interface';
import { GameInterface } from 'src/app/shared/interfaces/game.interface';
import { PlayerInterface } from 'src/app/shared/interfaces/player.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GamesService } from 'src/app/shared/services/games.service';
// TODO: add trycatch to promises
@Component({
  selector: 'app-play-page',
  templateUrl: './play-game.page.html',
  styleUrls: ['./play-game.page.scss']
})
export class PlayGamePage implements OnInit, OnDestroy {
  private gameSubscription: Subscription;
  private hasInitializedSession: boolean;
  private sessionUser: PlayerInterface | GameSessionUserInterface;
  private userName: string;
  public userId: string;
  public gameId: string;
  public game: GameInterface;
  public isLoading: boolean;
  public hasError: boolean;
  public isHost: boolean;
  public isPlayer = true;

  constructor(private authService: AuthService, private gamesService: GamesService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;

    this.userId = this.authService.user.uid;
    this.userName = this.authService.user.displayName || this.authService.user.email;
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

          if (!this.hasInitializedSession) {
            if (this.game.ownerId === this.userId) {
              this.isHost = true;
            }

            this.updateSession('enter');

            this.hasInitializedSession = true;
          }
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

    this.updateSession('leave');
  }

  private async updateSession(action: 'enter' | 'leave') {
    const gameId = this.game.id;

    if (action === 'enter') {
      if (this.isHost) {
        await this.gamesService.updateGameSessionIsActive(gameId, true);
      }

      this.sessionUser = {
        id: this.userId,
        name: this.userName,
        vote: {
          displayValue: ''
        }
      };

      await this.gamesService.updateGameSessionPlayers(gameId, this.sessionUser as PlayerInterface, 'add');
    }

    if (action === 'leave') {
      if (this.isHost) {
        await Promise.all([
          this.gamesService.updateGameSessionIsActive(gameId, false),
          this.gamesService.updateGameSessionHasStarted(gameId, false),
          this.gamesService.clearGameSessionPlayers(gameId),
          this.gamesService.clearGameSessionSpectators(gameId)
        ]);
      } else {
        if (this.isPlayer) {
          await this.gamesService.updateGameSessionPlayers(gameId, this.sessionUser as PlayerInterface, 'remove');
        } else {
          await this.gamesService.updateGameSessionSpectators(
            gameId,
            this.sessionUser as GameSessionUserInterface,
            'remove'
          );
        }
      }
    }

    this.isLoading = false;
  }
}
