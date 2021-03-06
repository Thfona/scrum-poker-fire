import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DialogDataInterface } from 'src/app/shared/interfaces/dialog-data.interface';
import { GameCardInterface } from 'src/app/shared/interfaces/game-card.interface';
import { GameDialogDataInterface } from 'src/app/shared/interfaces/game-dialog-data.interface';
import { GameDialogResultInterface } from 'src/app/shared/interfaces/game-dialog-result.interface';
import { GameInterface } from 'src/app/shared/interfaces/game.interface';
import { GameSettingsInterface } from 'src/app/shared/interfaces/game-settings.interface';
import { GameVoteInterface } from 'src/app/shared/interfaces/game-vote.interface';
import { PlayerWithVoteInterface } from 'src/app/shared/interfaces/player-with-vote.interface';
import { StoryDialogDataInterface } from 'src/app/shared/interfaces/story-dialog-data.interface';
import { StoryDialogResultInterface } from 'src/app/shared/interfaces/story-dialog-result.interface';
import { StoryInterface } from 'src/app/shared/interfaces/story.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GamesService } from 'src/app/shared/services/games.service';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ViewportService } from 'src/app/shared/services/viewport.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { GameDialogComponent } from 'src/app/shared/components/game-dialog/game-dialog.component';
import { InviteDialogComponent } from 'src/app/shared/components/invite-dialog/invite-dialog.component';
import { StoryDialogComponent } from 'src/app/shared/components/story-dialog/story-dialog.component';
import { SNACKBAR_ACTION } from 'src/app/shared/constants/snackbar-action.constant';
import { SNACKBAR_CONFIGURATION } from 'src/app/shared/constants/snackbar-configuration.constant';
import { generateUniqueIdUtil } from 'src/app/shared/utils/generateUniqueId.util';
import { DOMAIN } from 'src/app/shared/constants/domain.constant';

@Component({
  selector: 'app-play-page',
  templateUrl: './play-game.page.html',
  styleUrls: ['./play-game.page.scss'],
  providers: [GamesService, SidenavService, UserService, ViewportService]
})
export class PlayGamePage implements OnInit, OnDestroy {
  @ViewChild('editGameDialog') editGameDialog: GameDialogComponent;
  @ViewChild('deleteStoryDialog') deleteStoryDialog: DialogComponent;
  @ViewChild('exitGameDialog') exitGameDialog: DialogComponent;
  @ViewChild('inviteDialog') inviteDialog: InviteDialogComponent;
  @ViewChild('storyDialog') storyDialog: StoryDialogComponent;
  @ViewChild(MatMenuTrigger) usersMenu: MatMenuTrigger;
  private isDesktopSubscription: Subscription;
  private isLargeScreenSubscription: Subscription;
  private gameSubscription: Subscription;
  private hasInitializedSession: boolean;
  private userName: string;
  private cardMargin = '12px';
  private userCurrentVote: GameVoteInterface;
  private userToEditId: string;
  private storyDialogOperation: 'create' | 'edit';
  private storyToEditId: string;
  private currentStoryId: string;
  public userId: string;
  public gameId: string;
  public game: GameInterface;
  public cards: GameCardInterface[];
  public playersWithVotes: PlayerWithVoteInterface[];
  public currentStoryIndex: number;
  public currentStoryName: string;
  public hasFlippedCards: boolean;
  public isLoading: boolean;
  public hasError: boolean;
  public isHost: boolean;
  public isPlayer: boolean;
  public isDesktop: boolean;
  public isLargeScreen: boolean;
  public passVoteValue = 'PASS_CARD';
  public errorMessageCode = 'PLAY_GAME_ERROR_MESSAGE';

  constructor(
    private authService: AuthService,
    private gamesService: GamesService,
    private route: ActivatedRoute,
    private router: Router,
    public sidenavService: SidenavService,
    private snackBarService: MatSnackBar,
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

    this.isLargeScreenSubscription = this.viewportService.isLargeScreen.subscribe((isLargeScreen) => {
      if (this.isLargeScreen !== isLargeScreen && this.usersMenu) {
        this.usersMenu.closeMenu();
      }

      this.isLargeScreen = isLargeScreen;
    });

    this.gameSubscription = this.gamesService
      .getGame(this.gameId)
      .pipe(
        tap((game) => {
          this.hasError = false;
          this.game = game;

          if (
            !this.game ||
            (this.game.ownerId !== this.userId &&
              (!this.game.session.isActive ||
                (this.game.isPrivate && !this.game.authorizedUsers.includes(this.userId)))) ||
            this.game.bannedUsers.includes(this.userId)
          ) {
            throw new Error();
          }

          this.currentStoryId = this.game.session.currentStoryId;

          const CURRENT_STORY = this.game.stories.find((story) => story.id === this.currentStoryId);

          this.currentStoryIndex = CURRENT_STORY ? CURRENT_STORY.index : null;

          if (CURRENT_STORY) {
            this.currentStoryName = CURRENT_STORY.name;
            this.hasFlippedCards = CURRENT_STORY.hasFlippedCards;
          }

          this.userCurrentVote = this.game.session.votes.find(
            (vote) => vote.userId === this.userId && vote.storyId === this.currentStoryId
          );

          this.game.stories = this.game.stories.sort((a, b) => a.index - b.index);

          const PLAYERS = this.game.session.users.filter((user) => user.isPlayer);
          this.playersWithVotes = PLAYERS.map((player) => {
            const PLAYER_VOTE = this.game.session.votes.find(
              (vote) => vote.userId === player.id && vote.storyId === this.currentStoryId
            );

            return {
              ...player,
              vote: PLAYER_VOTE
            };
          });

          const CARDS = DOMAIN.cardSetOptions.find((cardSet) => {
            return cardSet.name === this.game.cardSet;
          }).cards;
          const VOTE_SKIP_OPTIONS = DOMAIN.voteSkipOptions;

          this.cards = [...CARDS, ...VOTE_SKIP_OPTIONS];

          const SESSION_USER = this.game.session.users.find((user) => user.id === this.userId);

          if (SESSION_USER) {
            this.isPlayer = SESSION_USER.isPlayer;
          }

          if (!this.hasInitializedSession) {
            if (this.game.ownerId === this.userId) {
              this.isHost = true;
            }

            this.initializeSession();

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

    if (this.isLargeScreenSubscription) {
      this.isLargeScreenSubscription.unsubscribe();
    }

    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  private handlePromiseError() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }

    this.hasError = true;
    this.isLoading = false;
  }

  private calculateScore(voteValues: number[]) {
    const SUM = voteValues.reduce((a, b) => a + b, 0);

    const AVERAGE = SUM / voteValues.length;

    const POSSIBLE_VALUES = this.cards.map((card) => {
      if (card.value) {
        return card.value;
      }
    });

    const AVERAGE_SCORE = POSSIBLE_VALUES.find((value) => value >= AVERAGE);

    return AVERAGE_SCORE;
  }

  private async initializeSession() {
    try {
      if (this.isHost && !this.game.session.isActive) {
        await this.gamesService.updateGameSessionIsActive(this.gameId, true);
      }

      const SESSION_USER = this.game.session.users.find((user) => user.id === this.userId);

      if (!SESSION_USER) {
        this.isPlayer = true;

        const NEW_SESSION_USER = {
          id: this.userId,
          name: this.userName,
          isPlayer: this.isPlayer
        };

        await this.gamesService.updateGameSessionUsers(this.gameId, NEW_SESSION_USER, 'add');
      }

      this.isLoading = false;
    } catch {
      this.handlePromiseError();
    }
  }

  public async swapUserRole(userId: string) {
    try {
      const SESSION_USER = this.game.session.users.find((user) => user.id === userId);

      await this.gamesService.updateGameSessionUsers(this.gameId, SESSION_USER, 'remove');

      SESSION_USER.isPlayer = !SESSION_USER.isPlayer;

      await this.gamesService.updateGameSessionUsers(this.gameId, SESSION_USER, 'add');
    } catch {
      this.handlePromiseError();
    }
  }

  public async handleCardClick(card: GameCardInterface) {
    if (!this.hasFlippedCards || this.game.allowVoteChangeAfterReveal) {
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

  public handleInviteButtonClick() {
    this.inviteDialog.openDialog();
  }

  public async handleStartGameButtonClick() {
    await this.gamesService.updateGameSessionCurrentStory(
      this.gameId,
      this.game.stories.find((story) => story.index === 0).id
    );
    await this.gamesService.updateGameSessionHasStarted(this.gameId, true);
  }

  public handleExitGameButtonClick() {
    const EXIT_GAME_DIALOG_DATA: DialogDataInterface = {
      title: this.translocoService.translate('EXIT_GAME'),
      content: this.translocoService.translate('EXIT_GAME_CONTENT'),
      confirmButtonText: this.translocoService.translate('EXIT'),
      confirmButtonColor: 'warn'
    };

    this.exitGameDialog.data = EXIT_GAME_DIALOG_DATA;

    this.exitGameDialog.openDialog();
  }

  public handleExitGameDialogConfirmation() {
    this.router.navigate(['home']);
  }

  public handleAddStoriesButtonClick() {
    this.storyDialogOperation = 'create';

    const CREATE_STORY_DIALOG_DATA: StoryDialogDataInterface = {
      title: this.translocoService.translate('CREATE_STORY_TITLE'),
      formData: {
        name: ''
      },
      isEditOperation: false
    };

    this.storyDialog.data = CREATE_STORY_DIALOG_DATA;

    this.storyDialog.openDialog();
  }

  public handleStoriesRowClick(story: StoryInterface) {
    if (this.isHost) {
      this.storyDialogOperation = 'edit';
      this.storyToEditId = story.id;

      const EDIT_STORY_DIALOG_DATA: StoryDialogDataInterface = {
        title: this.translocoService.translate('EDIT_STORY_TITLE', { storyName: story.name }),
        formData: {
          name: story.name,
          score: story.score
        },
        isEditOperation: true
      };

      this.storyDialog.data = EDIT_STORY_DIALOG_DATA;

      this.storyDialog.openDialog();
    }
  }

  public async handleStoryDialogConfirmation(storyDialogResult: StoryDialogResultInterface) {
    if (this.storyDialogOperation === 'create') {
      try {
        const NEW_STORY_INDEX: number = this.game.stories.length
          ? Math.max.apply(
              Math,
              this.game.stories.map((story) => story.index)
            ) + 1
          : 0;

        await this.gamesService.updateStories(
          this.gameId,
          {
            id: generateUniqueIdUtil(),
            index: NEW_STORY_INDEX,
            name: storyDialogResult.formValue.name,
            hasFlippedCards: false
          },
          'add'
        );
      } catch {
        this.snackBarService.open(
          this.translocoService.translate('CREATE_STORY_ERROR'),
          this.translocoService.translate(SNACKBAR_ACTION),
          SNACKBAR_CONFIGURATION
        );
      }
    }

    if (this.storyDialogOperation === 'edit') {
      const STORY = this.game.stories.find((story) => story.id === this.storyToEditId);

      if (storyDialogResult.delete) {
        const DELETE_STORY_DIALOG_DATA: DialogDataInterface = {
          title: this.translocoService.translate('DELETE_STORY_TITLE', { storyName: STORY.name }),
          content: this.translocoService.translate('DELETE_STORY_CONTENT', { storyName: STORY.name }),
          confirmButtonText: this.translocoService.translate('DELETE'),
          confirmButtonColor: 'warn'
        };

        this.deleteStoryDialog.data = DELETE_STORY_DIALOG_DATA;

        this.deleteStoryDialog.openDialog();
      } else {
        try {
          const NEW_STORY: StoryInterface = {
            id: STORY.id,
            index: STORY.index,
            name: storyDialogResult.formValue.name,
            hasFlippedCards: STORY.hasFlippedCards
          };

          if (storyDialogResult.formValue.score) {
            NEW_STORY.score = storyDialogResult.formValue.score;
          }

          const NEW_STORIES_LIST = this.game.stories.map((story) => {
            if (story.id === STORY.id) {
              return NEW_STORY;
            }

            return story;
          });

          await this.gamesService.updateStoriesList(this.gameId, NEW_STORIES_LIST);
        } catch {
          this.snackBarService.open(
            this.translocoService.translate('EDIT_STORY_ERROR'),
            this.translocoService.translate(SNACKBAR_ACTION),
            SNACKBAR_CONFIGURATION
          );
        }
      }
    }
  }

  public async handleDeleteStoryDialogConfirmation() {
    const STORY = this.game.stories.find((story) => story.id === this.storyToEditId);

    try {
      await this.gamesService.updateStories(this.gameId, STORY, 'remove');

      if (!this.game.stories.length) {
        if (this.game.session.hasStarted) {
          await this.gamesService.updateGameSessionHasStarted(this.gameId, false);
        }

        if (this.game.session.currentStoryId) {
          await this.gamesService.updateGameSessionCurrentStory(this.gameId, '');
        }
      } else {
        if (this.game.session.currentStoryId && this.game.session.currentStoryId === STORY.id) {
          const NEXT_STORY = this.game.stories.find((story) => story.index === STORY.index + 1);
          const PREVIOUS_STORY = this.game.stories.find((story) => story.index === STORY.index - 1);
          const NEW_CURRENT_STORY_ID = NEXT_STORY ? NEXT_STORY.id : PREVIOUS_STORY.id;

          await this.gamesService.updateGameSessionCurrentStory(this.gameId, NEW_CURRENT_STORY_ID);
        }

        const NEW_STORIES_LIST = this.game.stories.map((story) => {
          if (story.index > STORY.index) {
            return {
              ...story,
              index: story.index - 1
            };
          } else {
            return story;
          }
        });

        await this.gamesService.updateStoriesList(this.gameId, NEW_STORIES_LIST);
      }
    } catch {
      this.snackBarService.open(
        this.translocoService.translate('DELETE_STORY_ERROR'),
        this.translocoService.translate(SNACKBAR_ACTION),
        SNACKBAR_CONFIGURATION
      );
    }
  }

  // TODO: Finish implementation
  public handleUserMenuRowClick(userId: string) {
    this.userToEditId = userId;
  }

  public async handleResetCardsButtonClick() {
    try {
      const STORY = this.game.stories.find((story) => story.id === this.currentStoryId);

      delete STORY.score;

      const NEW_STORY: StoryInterface = {
        ...STORY,
        hasFlippedCards: false
      };

      const NEW_STORIES_LIST = this.game.stories.map((story) => {
        if (story.id === STORY.id) {
          return NEW_STORY;
        }

        return story;
      });

      const NEW_VOTES_LIST = this.game.session.votes.filter((vote) => vote.storyId !== this.currentStoryId);

      await this.gamesService.updateStoriesList(this.gameId, NEW_STORIES_LIST);
      await this.gamesService.updateGameSessionVotesList(this.gameId, NEW_VOTES_LIST);
    } catch {
      this.handlePromiseError();
    }
  }

  public async handleFlipCardsButtonClick() {
    if (!this.hasFlippedCards) {
      try {
        const STORY = this.game.stories.find((story) => story.id === this.currentStoryId);

        const VALID_PLAYERS_WITH_VOTES = this.playersWithVotes.filter((player) => player.vote && player.vote.value);

        const VOTE_VALUES = VALID_PLAYERS_WITH_VOTES.map((player) => player.vote.value);

        let newScore: number;

        if (this.game.calculateScore) {
          newScore = this.calculateScore(VOTE_VALUES);
        }

        const NEW_STORY: StoryInterface = {
          ...STORY,
          hasFlippedCards: true
        };

        if (newScore) {
          NEW_STORY.score = newScore;
        }

        const NEW_STORIES_LIST = this.game.stories.map((story) => {
          if (story.id === STORY.id) {
            return NEW_STORY;
          }

          return story;
        });

        await this.gamesService.updateStoriesList(this.gameId, NEW_STORIES_LIST);
      } catch {
        this.handlePromiseError();
      }
    }
  }

  public async handleFirstStoryButtonClick() {
    try {
      const NEW_CURRENT_STORY_ID = this.game.stories.find((story) => story.index === 0).id;

      await this.gamesService.updateGameSessionCurrentStory(this.gameId, NEW_CURRENT_STORY_ID);
    } catch {
      this.handlePromiseError();
    }
  }

  public async handleLastStoryButtonClick() {
    try {
      const NEW_CURRENT_STORY_ID = this.game.stories.find((story) => story.index === this.game.stories.length - 1).id;

      await this.gamesService.updateGameSessionCurrentStory(this.gameId, NEW_CURRENT_STORY_ID);
    } catch {
      this.handlePromiseError();
    }
  }

  public async handlePreviousStoryButtonClick() {
    try {
      const NEW_CURRENT_STORY_ID = this.game.stories.find((story) => story.index === this.currentStoryIndex - 1).id;

      await this.gamesService.updateGameSessionCurrentStory(this.gameId, NEW_CURRENT_STORY_ID);
    } catch {
      this.handlePromiseError();
    }
  }

  public async handleNextStoryButtonClick() {
    try {
      const NEW_CURRENT_STORY_ID = this.game.stories.find((story) => story.index === this.currentStoryIndex + 1).id;

      await this.gamesService.updateGameSessionCurrentStory(this.gameId, NEW_CURRENT_STORY_ID);
    } catch {
      this.handlePromiseError();
    }
  }

  public handleEditGameButtonClick() {
    const EDIT_GAME_DIALOG_DATA: GameDialogDataInterface = {
      title: this.translocoService.translate('EDIT_GAME_TITLE', { gameName: this.game.name }),
      formData: {
        name: this.game.name,
        description: this.game.description,
        teamVelocity: this.game.teamVelocity,
        shareVelocity: this.game.shareVelocity,
        isPrivate: this.game.isPrivate,
        cardSet: this.game.cardSet,
        autoFlip: this.game.autoFlip,
        allowVoteChangeAfterReveal: this.game.allowVoteChangeAfterReveal,
        calculateScore: this.game.calculateScore,
        storyTimer: this.game.storyTimer,
        storyTimerMinutes: this.game.storyTimerMinutes
      },
      shouldDisplaySaveAndStart: false
    };

    this.editGameDialog.data = EDIT_GAME_DIALOG_DATA;

    this.editGameDialog.openDialog();
  }

  public async handleEditGameDialogConfirmation(gameDialogResult: GameDialogResultInterface) {
    try {
      await this.gamesService.updateGame(this.gameId, gameDialogResult.formValue);
    } catch {
      this.snackBarService.open(
        this.translocoService.translate('EDIT_GAME_ERROR'),
        this.translocoService.translate(SNACKBAR_ACTION),
        SNACKBAR_CONFIGURATION
      );
    }

    if (gameDialogResult.saveAsDefaultSettings) {
      const GAME_SETTINGS: GameSettingsInterface = {
        teamVelocity: gameDialogResult.formValue.teamVelocity,
        shareVelocity: gameDialogResult.formValue.shareVelocity,
        isPrivate: gameDialogResult.formValue.isPrivate,
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
        this.snackBarService.open(
          this.translocoService.translate('UPDATE_USER_DEFAULT_GAME_SETTINGS_ERROR'),
          this.translocoService.translate(SNACKBAR_ACTION),
          SNACKBAR_CONFIGURATION
        );
      }
    }
  }
}
