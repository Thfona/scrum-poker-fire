import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GameInterface } from 'src/app/shared/interfaces/game.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GamesService } from 'src/app/shared/services/games.service';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { ViewportService } from 'src/app/shared/services/viewport.service';

@Component({
  selector: 'app-play-page',
  templateUrl: './play-game.page.html',
  styleUrls: ['./play-game.page.scss'],
  providers: [GamesService, SidenavService, ViewportService]
})
export class PlayGamePage implements OnInit, OnDestroy {
  private isDesktopSubscription: Subscription;
  private gameSubscription: Subscription;
  private hasInitializedSession: boolean;
  private userName: string;
  public userId: string;
  public gameId: string;
  public game: GameInterface;
  public isLoading: boolean;
  public hasError: boolean;
  public errorMessageCode = 'PLAY_GAME_ERROR_MESSAGE';
  public isHost: boolean;
  public isPlayer: boolean;
  public isDesktop: boolean;

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.updateSession('leave');
  }

  constructor(
    private authService: AuthService,
    private gamesService: GamesService,
    private route: ActivatedRoute,
    public sidenavService: SidenavService,
    private viewportService: ViewportService
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.userId = this.authService.user.uid;
    this.userName = this.authService.user.displayName || this.authService.user.email;
    this.gameId = this.route.snapshot.paramMap.get('gameId');

    this.isDesktopSubscription = this.viewportService.isDesktop.subscribe((isDesktop) => {
      if (this.isDesktop !== isDesktop) {
        if (isDesktop) {
          this.sidenavService.isSidenavOpen = true;
          this.sidenavService.sidenavState = 'on';
        } else {
          this.sidenavService.isSidenavOpen = false;
          this.sidenavService.sidenavState = 'off';
        }
      }

      this.isDesktop = isDesktop;
    });

    this.gameSubscription = this.gamesService
      .getGame(this.gameId)
      .pipe(
        tap((game) => {
          this.hasError = false;
          this.game = game;

          if (
            !this.game ||
            (this.game.ownerId !== this.userId && !this.game.session.isActive) ||
            this.game.bannedUsers.includes(this.userId)
          ) {
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
    if (this.isDesktopSubscription) {
      this.isDesktopSubscription.unsubscribe();
    }

    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }

    this.updateSession('leave');
  }

  private async updateSession(action: 'enter' | 'leave') {
    if (action === 'enter') {
      try {
        if (this.isHost) {
          await this.gamesService.updateGameSessionIsActive(this.gameId, true);
        }

        const SESSION_USER = this.game.session.users.find((user) => user.id === this.userId);

        if (SESSION_USER) {
          this.isPlayer = SESSION_USER.isPlayer;
        } else {
          this.isPlayer = true;

          const NEW_SESSION_USER = {
            id: this.userId,
            name: this.userName,
            isPlayer: this.isPlayer,
            vote: {
              displayValue: ''
            }
          };

          await this.gamesService.updateGameSessionUsers(this.gameId, NEW_SESSION_USER, 'add');
        }

        this.isLoading = false;
      } catch {
        this.handlePromiseError();
      }
    }

    if (action === 'leave') {
      if (this.isHost) {
        this.gamesService.updateGameSessionIsActive(this.gameId, false);
      }
    }
  }

  private handlePromiseError() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }

    this.hasError = true;
    this.isLoading = false;
  }

  public async swapUserRole(userId: string) {
    try {
      const SESSION_USER = this.game.session.users.find((user) => user.id === userId);

      await this.gamesService.updateGameSessionUsers(this.gameId, SESSION_USER, 'remove');

      SESSION_USER.isPlayer = !SESSION_USER.isPlayer;

      await this.gamesService.updateGameSessionUsers(this.gameId, SESSION_USER, 'add');

      this.isPlayer = !this.isPlayer;
    } catch {
      this.handlePromiseError();
    }
  }
}
