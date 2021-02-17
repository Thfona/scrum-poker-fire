import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslocoService } from '@ngneat/transloco';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DialogDataInterface } from 'src/app/shared/interfaces/dialog-data.interface';
import { GameDialogDataInterface } from 'src/app/shared/interfaces/game-dialog-data.interface';
import { GameDialogResultInterface } from 'src/app/shared/interfaces/game-dialog-result.interface';
import { GameInterface } from 'src/app/shared/interfaces/game.interface';
import { GameSettingsInterface } from 'src/app/shared/interfaces/game-settings.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DomainService } from 'src/app/shared/services/domain.service';
import { GamesService } from 'src/app/shared/services/games.service';
import { UserService } from 'src/app/shared/services/user.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { GameDialogComponent } from 'src/app/shared/components/game-dialog/game-dialog.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
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
  public displayedColumns: string[] = ['name', 'description', 'creationDate', 'options'];
  public games: GameInterface[] = [];
  public dataSource: MatTableDataSource<GameInterface>;
  public isLoading: boolean;
  public hasError: boolean;
  public cardTitleCode = 'SAVED_GAMES';
  public headerButtonTitleCode = 'CREATE_NEW_GAME_BUTTON_TEXT';
  public errorMessageCode = 'GAMES_ERROR_MESSAGE';

  constructor(
    private authService: AuthService,
    private domainService: DomainService,
    private gamesService: GamesService,
    private router: Router,
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
        catchError(() => {
          this.hasError = true;
          this.isLoading = false;
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

  public async handleRowClick(event: Event, game: GameInterface) {
    const ELEMENT_TAG = (event.target as HTMLElement).tagName;

    if (ELEMENT_TAG !== 'BUTTON' && ELEMENT_TAG !== 'MAT-ICON') {
      const GAME_ID = game.id;

      await this.router.navigate([`/play-game/${GAME_ID}`]);
    }
  }

  public handleCreateNewGameButtonClick() {
    this.gameDialogOperation = 'create';
    const USER = this.authService.user;
    const DOMAIN_DEFAULT_GAME_SETTINGS = this.domainService.getDomain().defaultGameSettings
      .values as GameSettingsInterface;

    const DEFAULT_GAME_SETTINGS = USER.defaultGameSettings ? USER.defaultGameSettings : DOMAIN_DEFAULT_GAME_SETTINGS;

    const CREATE_GAME_DIALOG_DATA: GameDialogDataInterface = {
      title: this.translocoService.translate('CREATE_GAME_TITLE'),
      formData: {
        name: '',
        description: '',
        ...DEFAULT_GAME_SETTINGS
      }
    };

    this.gameDialog.data = CREATE_GAME_DIALOG_DATA;

    this.gameDialog.openDialog();
  }

  public handleRowEditClick(game: GameInterface) {
    this.gameDialogOperation = 'edit';
    this.gameToEditId = game.id;
    const GAME_NAME = game.name;

    const EDIT_GAME_DIALOG_DATA: GameDialogDataInterface = {
      title: this.translocoService.translate('EDIT_GAME_TITLE', { gameName: GAME_NAME }),
      formData: {
        name: GAME_NAME,
        description: game.description,
        teamVelocity: game.teamVelocity,
        shareVelocity: game.shareVelocity,
        cardSet: game.cardSet,
        autoFlip: game.autoFlip,
        allowVoteChangeAfterReveal: game.allowVoteChangeAfterReveal,
        calculateScore: game.calculateScore,
        storyTimer: game.storyTimer,
        storyTimerMinutes: game.storyTimerMinutes
      }
    };

    this.gameDialog.data = EDIT_GAME_DIALOG_DATA;

    this.gameDialog.openDialog();
  }

  public async handleGameDialogConfirmation(gameDialogResult: GameDialogResultInterface) {
    this.isLoading = true;

    let gameId: string;

    if (this.gameDialogOperation === 'create') {
      await this.gamesService.createGame(gameDialogResult.formValue);

      gameId = this.gamesService.latestCreatedGameId;
    }

    if (this.gameDialogOperation === 'edit') {
      gameId = this.gameToEditId;

      await this.gamesService.updateGame(gameId, gameDialogResult.formValue);
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

      await this.userService.updateUserDefaultGameSettings(GAME_SETTINGS);
    }

    this.endLoading();

    if (gameDialogResult.start) {
      this.router.navigate([`play-game/${gameId}`]);
    }
  }

  public handleRowDeleteClick(game: GameInterface) {
    this.gameToDeleteId = game.id;
    const GAME_NAME = game.name;

    const DELETE_GAME_DIALOG_DATA: DialogDataInterface = {
      title: this.translocoService.translate('DELETE_GAME_TITLE', { gameName: GAME_NAME }),
      content: this.translocoService.translate('DELETE_GAME_CONTENT', { gameName: GAME_NAME }),
      confirmButtonText: this.translocoService.translate('DELETE'),
      confirmButtonColor: 'warn'
    };

    this.deleteGameDialog.data = DELETE_GAME_DIALOG_DATA;

    this.deleteGameDialog.openDialog();
  }

  public async handleDeleteConfirmation() {
    this.isLoading = true;

    await this.gamesService.deleteGame(this.gameToDeleteId);

    this.endLoading();
  }
}
