import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TranslocoService } from '@jsverse/transloco';
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
    selector: 'app-saved-games-fragment',
    templateUrl: './saved-games.fragment.html',
    styleUrls: ['./saved-games.fragment.scss'],
    providers: [GamesService],
    standalone: false,
})
export class SavedGamesFragment implements OnInit, OnDestroy {
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
        'options',
    ];
    public games: GameInterface[] = [];
    public dataSource: MatTableDataSource<GameInterface>;
    public isLoading: boolean;
    public hasError: boolean;

    constructor(
        private readonly gamesService: GamesService,
        private readonly router: Router,
        private readonly snackBarService: MatSnackBar,
        private readonly translocoService: TranslocoService,
        private readonly userService: UserService,
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
                }),
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
            const filterValue = (event.target as HTMLInputElement).value;

            this.dataSource.filter = filterValue.trim().toLowerCase();
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
        const elementTag = (event.target as HTMLElement).tagName;

        if (elementTag !== 'BUTTON' && elementTag !== 'MAT-ICON') {
            this.router.navigate([`/poker/${game.id}`]);
        }
    }

    public handleCreateNewGameButtonClick() {
        this.gameDialogOperation = 'create';

        const defaultGameSettings = this.userService.defaultGameSettingsState || DOMAIN.defaultGameSettings;

        const createGameDialogData: GameDialogDataInterface = {
            title: this.translocoService.translate('CREATE_GAME_TITLE'),
            formData: {
                name: '',
                description: '',
                ...defaultGameSettings,
            },
            shouldDisplaySaveAndStart: true,
        };

        this.gameDialog.data = createGameDialogData;

        this.gameDialog.openDialog();
    }

    public handleTableRowEditClick(event: Event, game: GameInterface) {
        event.preventDefault();
        event.stopPropagation();

        this.gameDialogOperation = 'edit';
        this.gameToEditId = game.id;

        const editGameDialogData: GameDialogDataInterface = {
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
                storyTimerMinutes: game.storyTimerMinutes,
            },
            shouldDisplaySaveAndStart: true,
        };

        this.gameDialog.data = editGameDialogData;

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
                    SNACKBAR_CONFIGURATION,
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
                    SNACKBAR_CONFIGURATION,
                );

                console.error(error);
            }
        }

        if (gameDialogResult.saveAsDefaultSettings) {
            const gameSettings: GameSettingsInterface = {
                teamVelocity: gameDialogResult.formValue.teamVelocity,
                shareVelocity: gameDialogResult.formValue.shareVelocity,
                isPrivate: gameDialogResult.formValue.isPrivate,
                cardSet: gameDialogResult.formValue.cardSet,
                autoFlip: gameDialogResult.formValue.autoFlip,
                allowVoteChangeAfterReveal: gameDialogResult.formValue.allowVoteChangeAfterReveal,
                calculateScore: gameDialogResult.formValue.calculateScore,
                storyTimer: gameDialogResult.formValue.storyTimer,
                storyTimerMinutes: gameDialogResult.formValue.storyTimerMinutes,
            };

            try {
                await this.userService.updateUserDefaultGameSettings(gameSettings);
            } catch (error) {
                this.snackBarService.open(
                    this.translocoService.translate('UPDATE_USER_DEFAULT_GAME_SETTINGS_ERROR'),
                    this.translocoService.translate(SNACKBAR_ACTION),
                    SNACKBAR_CONFIGURATION,
                );

                console.error(error);
            }
        }

        this.endLoading();

        if (gameDialogResult.start && !hasError) {
            this.router.navigate([`/poker/${gameId}`]);
        }
    }

    public handleTableRowDeleteClick(event: Event, game: GameInterface) {
        event.preventDefault();
        event.stopPropagation();

        this.gameToDeleteId = game.id;

        const deleteGameDialogData: DialogDataInterface = {
            title: this.translocoService.translate('DELETE_GAME_TITLE', { gameName: game.name }),
            content: this.translocoService.translate('DELETE_GAME_CONTENT', { gameName: game.name }),
            confirmButtonText: this.translocoService.translate('DELETE'),
            confirmButtonColor: 'warn',
        };

        this.deleteGameDialog.data = deleteGameDialogData;

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
                SNACKBAR_CONFIGURATION,
            );

            console.error(error);
        }

        this.endLoading();
    }
}
