import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GameCardInterface } from 'src/app/shared/interfaces/game-card.interface';
import { GameDialogDataInterface } from 'src/app/shared/interfaces/game-dialog-data.interface';
import { GameDialogResultInterface } from 'src/app/shared/interfaces/game-dialog-result.interface';
import { GameSettingsInterface } from 'src/app/shared/interfaces/game-settings.interface';
import { GameVoteInterface } from 'src/app/shared/interfaces/game-vote.interface';
import { GameInterface } from 'src/app/shared/interfaces/game.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DomainService } from 'src/app/shared/services/domain.service';
import { GamesService } from 'src/app/shared/services/games.service';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ViewportService } from 'src/app/shared/services/viewport.service';
import { GameDialogComponent } from 'src/app/shared/components/game-dialog/game-dialog.component';
import { SNACKBAR_ACTION } from 'src/app/shared/constants/snackbar-action.constant';
import { SNACKBAR_CONFIGURATION } from 'src/app/shared/constants/snackbar-configuration.constant';

@Component({
  selector: 'app-play-page',
  templateUrl: './play-game.page.html',
  styleUrls: ['./play-game.page.scss'],
  providers: [GamesService, SidenavService, UserService, ViewportService]
})
export class PlayGamePage implements OnInit, OnDestroy {
  @ViewChild('editGameDialog') editGameDialog: GameDialogComponent;
  private isDesktopSubscription: Subscription;
  private gameSubscription: Subscription;
  private hasInitializedSession: boolean;
  private userName: string;
  private cardMargin = '10px';
  private hasRevealedVotes: boolean;
  private userCurrentVote: GameVoteInterface;
  public userId: string;
  public gameId: string;
  public game: GameInterface;
  public cards: GameCardInterface[];
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
    private domainService: DomainService,
    private gamesService: GamesService,
    private route: ActivatedRoute,
    public sidenavService: SidenavService,
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService,
    private userService: UserService,
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

          const DOMAIN = this.domainService.getDomain();
          const cards = DOMAIN.cardSetOptions.values.find((cardSet) => {
            return cardSet.name === this.game.cardSet;
          }).cards;
          const voteSkipOptions = DOMAIN.voteSkipOptions.values;

          this.cards = [...cards, ...voteSkipOptions];

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
            isPlayer: this.isPlayer
          };

          await this.gamesService.updateGameSessionUsers(this.gameId, NEW_SESSION_USER, 'add');
        }

        this.userCurrentVote = this.game.session.votes.find(
          (vote) => vote.userId === this.userId && vote.storyId === this.game.session.currentStoryId
        );

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

  public async handleCardClick(card: GameCardInterface) {
    if (!this.hasRevealedVotes || this.game.allowVoteChangeAfterReveal) {
      try {
        if (this.userCurrentVote && this.userCurrentVote.displayValue === card.displayValue) {
          await this.gamesService.updateGameSessionVotes(this.gameId, this.userCurrentVote, 'remove');

          this.userCurrentVote = undefined;

          return;
        }

        if (this.userCurrentVote) {
          await this.gamesService.updateGameSessionVotes(this.gameId, this.userCurrentVote, 'remove');
        }

        const USER_NEW_VOTE: GameVoteInterface = {
          userId: this.userId,
          storyId: this.game.session.currentStoryId,
          ...card
        };

        await this.gamesService.updateGameSessionVotes(this.gameId, USER_NEW_VOTE, 'add');

        this.userCurrentVote = USER_NEW_VOTE;
      } catch {
        this.handlePromiseError();
      }
    }
  }

  public getCardMargin(index: number) {
    return `max(calc(${this.cardMargin} + ${index * 7.6}%), calc(${this.cardMargin} + ${index * 45}px))`;
  }

  public getCardZIndex(index: number) {
    return 2 + index;
  }

  public getIsCardSelected(card: GameCardInterface) {
    return this.userCurrentVote && this.userCurrentVote.displayValue === card.displayValue;
  }

  // TODO: Finish implementation
  public handleInviteButtonClick() {
    console.log('invite');
  }

  // TODO: Finish implementation
  public handleStartGameButtonClick() {
    console.log('startgame');
  }

  public handleEditGameClick(game: GameInterface) {
    const EDIT_GAME_DIALOG_DATA: GameDialogDataInterface = {
      title: this.translocoService.translate('EDIT_GAME_TITLE', { gameName: game.name }),
      formData: {
        name: game.name,
        description: game.description,
        teamVelocity: game.teamVelocity,
        shareVelocity: game.shareVelocity,
        cardSet: game.cardSet,
        autoFlip: game.autoFlip,
        allowVoteChangeAfterReveal: game.allowVoteChangeAfterReveal,
        calculateScore: game.calculateScore,
        storyTimer: game.storyTimer,
        storyTimerMinutes: game.storyTimerMinutes
      },
      shouldDisplaySaveAndStart: true
    };

    this.editGameDialog.data = EDIT_GAME_DIALOG_DATA;

    this.editGameDialog.openDialog();
  }

  public async handleEditGameDialogConfirmation(gameDialogResult: GameDialogResultInterface) {
    this.isLoading = true;

    try {
      await this.gamesService.updateGame(this.gameId, gameDialogResult.formValue);
    } catch {
      this.snackBar.open(
        this.translocoService.translate('EDIT_GAME_ERROR'),
        this.translocoService.translate(SNACKBAR_ACTION),
        SNACKBAR_CONFIGURATION
      );
    }

    if (gameDialogResult.saveAsDefaultSettings) {
      const GAME_SETTINGS: GameSettingsInterface = {
        teamVelocity: gameDialogResult.formValue.teamVelocity,
        shareVelocity: gameDialogResult.formValue.shareVelocity,
        cardSet: gameDialogResult.formValue.cardSet,
        autoFlip: gameDialogResult.formValue.autoFlip,
        allowVoteChangeAfterReveal: gameDialogResult.formValue.allowVoteChangeAfterReveal,
        calculateScore: gameDialogResult.formValue.calculateScore,
        storyTimer: gameDialogResult.formValue.storyTimer,
        storyTimerMinutes: gameDialogResult.formValue.storyTimerMinutes
      };

      try {
        await this.userService.updateUserDefaultGameSettings(GAME_SETTINGS);
      } catch {
        this.snackBar.open(
          this.translocoService.translate('UPDATE_USER_DEFAULT_GAME_SETTINGS_ERROR'),
          this.translocoService.translate(SNACKBAR_ACTION),
          SNACKBAR_CONFIGURATION
        );
      }
    }

    this.isLoading = false;
  }
}
