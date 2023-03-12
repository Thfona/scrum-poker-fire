import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { TranslocoService } from '@ngneat/transloco';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DialogDataInterface } from 'src/app/shared/interfaces/dialog-data.interface';
import { GameDialogDataInterface } from 'src/app/shared/interfaces/game-dialog-data.interface';
import { GameDialogResultInterface } from 'src/app/shared/interfaces/game-dialog-result.interface';
import { GameInterface } from 'src/app/shared/interfaces/game.interface';
import { GameSettingsInterface } from 'src/app/shared/interfaces/game-settings.interface';
import { StoryInterface } from 'src/app/shared/interfaces/story.interface';
import { GamesService } from 'src/app/shared/services/games.service';
import { UserService } from 'src/app/shared/services/user.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { GameDialogComponent } from 'src/app/shared/components/game-dialog/game-dialog.component';
import { DOMAIN } from 'src/app/shared/constants/domain.constant';
import { SNACKBAR_ACTION } from 'src/app/shared/constants/snackbar-action.constant';
import { SNACKBAR_CONFIGURATION } from 'src/app/shared/constants/snackbar-configuration.constant';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [GamesService]
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('tablePaginator') paginator: MatPaginator;
  @ViewChild('gameDialog') gameDialog: GameDialogComponent;
  @ViewChild('deleteGameDialog') deleteGameDialog: DialogComponent;
  private gamesSubscription: Subscription;
  private timeout: any;
  private gameToEditId: string;
  private gameToDeleteId: string;
  private hasLoadedFirstTime: boolean;
  private gameDialogOperation: 'create' | 'edit';
  public displayedColumns: string[] = [
    'name',
    'description',
    'cardSet',
    'numberOfStories',
    'totalEffort',
    'creationDate',
    'options'
  ];
  public games: GameInterface[] = [];
  public dataSource: MatTableDataSource<GameInterface>;
  public isLoading: boolean;
  public hasError: boolean;
  public cardTitleCode = 'SAVED_GAMES';
  public headerButtonIconCode = 'add';
  public headerButtonTextCode = 'CREATE_NEW_GAME_BUTTON_TEXT';
  public errorMessageCode = 'GAMES_ERROR_MESSAGE';

  constructor(
    private gamesService: GamesService,
    private router: Router,
    private snackBarService: MatSnackBar,
    private translocoService: TranslocoService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.gamesSubscription = this.gamesService
      .getGames()
      .pipe(
        tap((games) => {
          this.hasError = false;
          this.games = games;
          this.dataSource = new MatTableDataSource(this.games);

          if (!this.hasLoadedFirstTime) {
            this.isLoading = false;
            this.hasLoadedFirstTime = true;
          }

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 0);
        }),
        catchError((error) => {
          this.hasError = true;

          this.isLoading = false;

          console.error(error);

          return EMPTY;
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.gamesSubscription) {
      this.gamesSubscription.unsubscribe();
    }
  }

  private endLoading() {
    this.isLoading = false;

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 0);
  }

  public applyFilter(event: Event) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      const FILTER_VALUE = (event.target as HTMLInputElement).value;

      this.dataSource.filter = FILTER_VALUE.trim().toLowerCase();
    }, 600);
  }

  public calculateTotalGameEffort(stories: StoryInterface[]) {
    if (!stories.length) {
      return 0;
    }

    let total = 0;

    stories.map((story) => {
      if (story.score) {
        total += +story.score;
      }
    });

    return total;
  }

  public handleTableRowClick(event: Event, game: GameInterface) {
    const ELEMENT_TAG = (event.target as HTMLElement).tagName;

    if (ELEMENT_TAG !== 'BUTTON' && ELEMENT_TAG !== 'MAT-ICON') {
      this.router.navigate([`/play-game/${game.id}`]);
    }
  }

  public handleCreateNewGameButtonClick() {
    this.gameDialogOperation = 'create';

    const DEFAULT_GAME_SETTINGS = this.userService.defaultGameSettingsState
      ? this.userService.defaultGameSettingsState
      : DOMAIN.defaultGameSettings;

    const CREATE_GAME_DIALOG_DATA: GameDialogDataInterface = {
      title: this.translocoService.translate('CREATE_GAME_TITLE'),
      formData: {
        name: '',
        description: '',
        ...DEFAULT_GAME_SETTINGS
      },
      shouldDisplaySaveAndStart: true
    };

    this.gameDialog.data = CREATE_GAME_DIALOG_DATA;

    this.gameDialog.openDialog();
  }

  public handleTableRowEditClick(game: GameInterface) {
    this.gameDialogOperation = 'edit';
    this.gameToEditId = game.id;

    const EDIT_GAME_DIALOG_DATA: GameDialogDataInterface = {
      title: this.translocoService.translate('EDIT_GAME_TITLE', { gameName: game.name }),
      formData: {
        name: game.name,
        description: game.description,
        teamVelocity: game.teamVelocity,
        shareVelocity: game.shareVelocity,
        isPrivate: game.isPrivate,
        cardSet: game.cardSet,
        autoFlip: game.autoFlip,
        allowVoteChangeAfterReveal: game.allowVoteChangeAfterReveal,
        calculateScore: game.calculateScore,
        storyTimer: game.storyTimer,
        storyTimerMinutes: game.storyTimerMinutes
      },
      shouldDisplaySaveAndStart: true
    };

    this.gameDialog.data = EDIT_GAME_DIALOG_DATA;

    this.gameDialog.openDialog();
  }

  public async handleGameDialogConfirmation(gameDialogResult: GameDialogResultInterface) {
    let hasError = false;
    this.isLoading = true;

    let gameId: string;

    if (this.gameDialogOperation === 'create') {
      try {
        await this.gamesService.createGame(gameDialogResult.formValue);
      } catch (error) {
        hasError = true;

        this.snackBarService.open(
          this.translocoService.translate('CREATE_GAME_ERROR'),
          this.translocoService.translate(SNACKBAR_ACTION),
          SNACKBAR_CONFIGURATION
        );

        console.error(error);
      }

      gameId = this.gamesService.latestCreatedGameId;
    }

    if (this.gameDialogOperation === 'edit') {
      gameId = this.gameToEditId;

      try {
        await this.gamesService.updateGame(gameId, gameDialogResult.formValue);
      } catch (error) {
        hasError = true;

        this.snackBarService.open(
          this.translocoService.translate('EDIT_GAME_ERROR'),
          this.translocoService.translate(SNACKBAR_ACTION),
          SNACKBAR_CONFIGURATION
        );

        console.error(error);
      }
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
      } catch (error) {
        this.snackBarService.open(
          this.translocoService.translate('UPDATE_USER_DEFAULT_GAME_SETTINGS_ERROR'),
          this.translocoService.translate(SNACKBAR_ACTION),
          SNACKBAR_CONFIGURATION
        );

        console.error(error);
      }
    }

    this.endLoading();

    if (gameDialogResult.start && !hasError) {
      this.router.navigate([`play-game/${gameId}`]);
    }
  }

  public handleTableRowDeleteClick(game: GameInterface) {
    this.gameToDeleteId = game.id;

    const DELETE_GAME_DIALOG_DATA: DialogDataInterface = {
      title: this.translocoService.translate('DELETE_GAME_TITLE', { gameName: game.name }),
      content: this.translocoService.translate('DELETE_GAME_CONTENT', { gameName: game.name }),
      confirmButtonText: this.translocoService.translate('DELETE'),
      confirmButtonColor: 'warn'
    };

    this.deleteGameDialog.data = DELETE_GAME_DIALOG_DATA;

    this.deleteGameDialog.openDialog();
  }

  public async handleDeleteGameDialogConfirmation() {
    this.isLoading = true;

    try {
      await this.gamesService.deleteGame(this.gameToDeleteId);
    } catch (error) {
      this.snackBarService.open(
        this.translocoService.translate('DELETE_GAME_ERROR'),
        this.translocoService.translate(SNACKBAR_ACTION),
        SNACKBAR_CONFIGURATION
      );

      console.error(error);
    }

    this.endLoading();
  }
}
