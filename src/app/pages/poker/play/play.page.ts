import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DialogDataInterface } from 'src/app/shared/interfaces/dialog-data.interface';
import { GameCardInterface } from 'src/app/shared/interfaces/game-card.interface';
import { GameDialogDataInterface } from 'src/app/shared/interfaces/game-dialog-data.interface';
import { GameDialogResultInterface } from 'src/app/shared/interfaces/game-dialog-result.interface';
import { GameInterface } from 'src/app/shared/interfaces/game.interface';
import { GameSettingsInterface } from 'src/app/shared/interfaces/game-settings.interface';
import { GameVoteInterface } from 'src/app/shared/interfaces/game-vote.interface';
import { PlayerWithVoteInfoInterface } from 'src/app/shared/interfaces/player-with-vote.interface';
import { RemoveUserDialogDataInterface } from 'src/app/shared/interfaces/remove-user-dialog-data.interface';
import { RemoveUserDialogResultInterface } from 'src/app/shared/interfaces/remove-user-dialog-result.interface';
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
import { RemoveUserDialogComponent } from 'src/app/shared/components/remove-user-dialog/remove-user-dialog.component';
import { StoryDialogComponent } from 'src/app/shared/components/story-dialog/story-dialog.component';
import { generateUniqueId } from 'src/app/shared/utils/generate-unique-id.util';
import { SNACKBAR_ACTION } from 'src/app/shared/constants/snackbar-action.constant';
import { SNACKBAR_CONFIGURATION } from 'src/app/shared/constants/snackbar-configuration.constant';
import { DOMAIN } from 'src/app/shared/constants/domain.constant';

@Component({
    selector: 'app-play-page',
    templateUrl: './play.page.html',
    styleUrls: ['./play.page.scss'],
    providers: [GamesService, SidenavService, ViewportService],
    standalone: false,
})
export class PlayPage implements OnInit, OnDestroy {
    @ViewChild('editGameDialog') editGameDialog: GameDialogComponent;
    @ViewChild('inviteDialog') inviteDialog: InviteDialogComponent;
    @ViewChild('storyDialog') storyDialog: StoryDialogComponent;
    @ViewChild('deleteStoryDialog') deleteStoryDialog: DialogComponent;
    @ViewChild('exitGameDialog') exitGameDialog: DialogComponent;
    @ViewChild('removeUserDialog') removeUserDialog: RemoveUserDialogComponent;
    @ViewChild(MatMenuTrigger) usersMenu: MatMenuTrigger;
    private isDesktopSubscription: Subscription;
    private isLargeScreenSubscription: Subscription;
    private gameSubscription: Subscription;
    private hasJoinedSession: boolean;
    private userName: string;
    private cardMargin = '12px';
    private userCurrentVote: GameVoteInterface;
    private userToRemoveId: string;
    private storyDialogOperation: 'create' | 'edit';
    private storyToEditId: string;
    private currentStoryId: string;
    public userId: string;
    public gameId: string;
    public game: GameInterface;
    public cards: GameCardInterface[];
    public playersWithVoteInfo: PlayerWithVoteInfoInterface[];
    public currentStoryIndex: number;
    public currentStoryName: string;
    public hasFlippedCards: boolean;
    public isLoading: boolean;
    public hasError: boolean;
    public isHost: boolean;
    public isPlayer: boolean;
    public isDesktop: boolean;
    public isLargeScreen: boolean;

    get isPrivateAccess() {
        return (
            this.game.ownerId !== this.userId &&
            (
                !this.game.session.isActive ||
                (this.game.isPrivate && !this.game.authorizedUsers.includes(this.userId))
            )
        );
    }

    constructor(
        private readonly authService: AuthService,
        private readonly gamesService: GamesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly snackBarService: MatSnackBar,
        private readonly translocoService: TranslocoService,
        private readonly userService: UserService,
        private readonly viewportService: ViewportService,
        public readonly sidenavService: SidenavService,
    ) {}

    ngOnInit() {
        this.isLoading = true;

        this.userId = this.authService.user.uid;
        this.userName = this.authService.user.displayName || this.authService.user.email;
        this.gameId = this.activatedRoute.snapshot.paramMap.get('gameId');

        this.isDesktopSubscription = this.viewportService.isDesktopObservable.subscribe((value) => {
            if (this.isDesktop !== value) {
                if (value) {
                    this.sidenavService.isSidenavOpen = true;
                    this.sidenavService.sidenavState = 'on';
                } else {
                    this.sidenavService.isSidenavOpen = false;
                    this.sidenavService.sidenavState = 'off';
                }
            }

            this.isDesktop = value;
        });

        this.isLargeScreenSubscription = this.viewportService.isLargeScreenObservable.subscribe((value) => {
            if (this.isLargeScreen !== value && this.usersMenu) {
                this.usersMenu.closeMenu();
            }

            this.isLargeScreen = value;
        });

        this.gameSubscription = this.gamesService
            .getGame(this.gameId)
            .pipe(
                tap((game) => {
                    this.hasError = false;
                    this.game = game;

                    if (!this.game || this.isPrivateAccess || this.game.bannedUsers.includes(this.userId)) {
                        throw new Error('Game not found or access forbidden.');
                    }

                    if (this.game.ownerId === this.userId) {
                        this.isHost = true;
                    }

                    this.currentStoryId = this.game.session.currentStoryId;

                    const currentStory = this.game.stories.find((story) => story.id === this.currentStoryId);

                    this.currentStoryIndex = currentStory ? currentStory.index : null;

                    if (currentStory) {
                        this.currentStoryName = currentStory.name;
                        this.hasFlippedCards = currentStory.hasFlippedCards;
                    }

                    this.userCurrentVote = this.game.session.votes.find(
                        (vote) => vote.userId === this.userId && vote.storyId === this.currentStoryId,
                    );

                    this.game.stories = this.game.stories.sort((a, b) => a.index - b.index);

                    const players = this.game.session.users.filter((user) => user.isPlayer);

                    this.playersWithVoteInfo = players.map((player) => {
                        const playerVote = this.game.session.votes.find(
                            (vote) => vote.userId === player.id && vote.storyId === this.currentStoryId,
                        );

                        return {
                            ...player,
                            vote: playerVote,
                        };
                    });

                    const cards = DOMAIN.cardSetOptions.find((cardSet) => {
                        return cardSet.name === this.game.cardSet;
                    }).cards;

                    this.cards = [...cards, ...DOMAIN.voteSkipOptions];

                    const sessionUser = this.game.session.users.find((user) => user.id === this.userId);

                    if (sessionUser) {
                        this.isPlayer = sessionUser.isPlayer;
                    }

                    if (!this.hasJoinedSession) {
                        this.joinSession();

                        this.hasJoinedSession = true;
                    }

                    const playersWithVote = this.playersWithVoteInfo.filter((player) => player.vote);

                    if (this.game.autoFlip && playersWithVote.length === this.playersWithVoteInfo.length) {
                        this.handleFlipCards();
                    }
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
        const sum = voteValues.reduce((a, b) => a + b, 0);

        const average = sum / voteValues.length;

        const possibleValues = this.cards.map((card) => {
            if (card.value) {
                return card.value;
            }
        });

        const averageScore = possibleValues.find((value) => value >= average);

        return averageScore;
    }

    private async joinSession() {
        try {
            if (this.isHost && !this.game.session.isActive) {
                await this.gamesService.updateIsActive(this.gameId, true);
            }

            const sessionUser = this.game.session.users.find((user) => user.id === this.userId);

            if (!sessionUser) {
                this.isPlayer = true;

                const newSessionUser = {
                    id: this.userId,
                    name: this.userName,
                    isPlayer: this.isPlayer,
                };

                await this.gamesService.updateUsers(this.gameId, newSessionUser, 'add');
            }

            this.isLoading = false;
        } catch (error) {
            this.handlePromiseError();

            console.error(error);
        }
    }

    public async swapUserRole(userId: string) {
        try {
            const sessionUser = this.game.session.users.find((user) => user.id === userId);

            await this.gamesService.updateUsers(this.gameId, sessionUser, 'remove');

            sessionUser.isPlayer = !sessionUser.isPlayer;

            await this.gamesService.updateUsers(this.gameId, sessionUser, 'add');
        } catch (error) {
            this.handlePromiseError();

            console.error(error);
        }
    }

    public async handleCardClick(card: GameCardInterface) {
        if (!this.hasFlippedCards || this.game.allowVoteChangeAfterReveal) {
            try {
                if (this.userCurrentVote && this.userCurrentVote.displayValue === card.displayValue) {
                    await this.gamesService.updateVotes(this.gameId, this.userCurrentVote, 'remove');

                    this.userCurrentVote = undefined;

                    return;
                }

                if (this.userCurrentVote) {
                    await this.gamesService.updateVotes(this.gameId, this.userCurrentVote, 'remove');
                }

                const userNewVote: GameVoteInterface = {
                    userId: this.userId,
                    storyId: this.game.session.currentStoryId,
                    ...card,
                };

                await this.gamesService.updateVotes(this.gameId, userNewVote, 'add');

                this.userCurrentVote = userNewVote;
            } catch (error) {
                this.handlePromiseError();

                console.error(error);
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
        await this.gamesService.updateCurrentStory(this.gameId, this.game.stories.find((story) => story.index === 0).id);

        await this.gamesService.updateHasStarted(this.gameId, true);
    }

    public handleExitGameButtonClick() {
        const exitGameDialogData: DialogDataInterface = {
            title: this.translocoService.translate('EXIT_GAME'),
            content: this.translocoService.translate('EXIT_GAME_CONTENT'),
            confirmButtonText: this.translocoService.translate('EXIT'),
            confirmButtonColor: 'warn',
        };

        this.exitGameDialog.data = exitGameDialogData;

        this.exitGameDialog.openDialog();
    }

    public handleExitGameDialogConfirmation() {
        this.router.navigate(['/home']);
    }

    public handleAddStoriesButtonClick() {
        this.storyDialogOperation = 'create';

        const createStoryDialogData: StoryDialogDataInterface = {
            title: this.translocoService.translate('CREATE_STORY_TITLE'),
            formData: {
                name: '',
            },
            isEditOperation: false,
            gameHasStarted: this.game.session.hasStarted,
        };

        this.storyDialog.data = createStoryDialogData;

        this.storyDialog.openDialog();
    }

    public handleStoriesRowClick(story: StoryInterface) {
        if (this.isHost) {
            this.storyDialogOperation = 'edit';
            this.storyToEditId = story.id;

            const editStoryDialogData: StoryDialogDataInterface = {
                title: this.translocoService.translate('EDIT_STORY_TITLE', { storyName: story.name }),
                formData: {
                    name: story.name,
                    score: story.score,
                },
                isEditOperation: true,
                gameHasStarted: this.game.session.hasStarted,
            };

            this.storyDialog.data = editStoryDialogData;

            this.storyDialog.openDialog();
        }
    }

    public async handleStoryDialogConfirmation(storyDialogResult: StoryDialogResultInterface) {
        if (this.storyDialogOperation === 'create') {
            try {
                const newStoryIndex: number = this.game.stories.length
                    ? Math.max(...this.game.stories.map((story) => story.index)) + 1
                    : 0;

                await this.gamesService.updateStories(
                    this.gameId,
                    {
                        id: generateUniqueId(),
                        index: newStoryIndex,
                        name: storyDialogResult.formValue.name,
                        hasFlippedCards: false,
                    },
                    'add',
                );
            } catch (error) {
                this.snackBarService.open(
                    this.translocoService.translate('CREATE_STORY_ERROR'),
                    this.translocoService.translate(SNACKBAR_ACTION),
                    SNACKBAR_CONFIGURATION,
                );

                console.error(error);
            }
        }

        if (this.storyDialogOperation === 'edit') {
            const story = this.game.stories.find((story) => story.id === this.storyToEditId);

            if (storyDialogResult.goTo) {
                try {
                    this.gamesService.updateCurrentStory(this.gameId, story.id);
                } catch (error) {
                    this.handlePromiseError();

                    console.error(error);
                }
            } else if (storyDialogResult.delete) {
                const deleteStoryDialogData: DialogDataInterface = {
                    title: this.translocoService.translate('DELETE_STORY_TITLE', { storyName: story.name }),
                    content: this.translocoService.translate('DELETE_STORY_CONTENT', { storyName: story.name }),
                    confirmButtonText: this.translocoService.translate('DELETE'),
                    confirmButtonColor: 'warn',
                };

                this.deleteStoryDialog.data = deleteStoryDialogData;

                this.deleteStoryDialog.openDialog();
            } else {
                try {
                    const newStory: StoryInterface = {
                        id: story.id,
                        index: story.index,
                        name: storyDialogResult.formValue.name,
                        hasFlippedCards: story.hasFlippedCards,
                    };

                    if (storyDialogResult.formValue.score) {
                        newStory.score = storyDialogResult.formValue.score;
                    }

                    const newStoriesList = this.game.stories.map((story) => {
                        if (story.id === story.id) {
                            return newStory;
                        }

                        return story;
                    });

                    await this.gamesService.updateStoriesList(this.gameId, newStoriesList);
                } catch (error) {
                    this.snackBarService.open(
                        this.translocoService.translate('EDIT_STORY_ERROR'),
                        this.translocoService.translate(SNACKBAR_ACTION),
                        SNACKBAR_CONFIGURATION,
                    );

                    console.error(error);
                }
            }
        }
    }

    public async handleDeleteStoryDialogConfirmation() {
        const story = this.game.stories.find((story) => story.id === this.storyToEditId);

        try {
            await this.gamesService.updateStories(this.gameId, story, 'remove');

            if (!this.game.stories.length) {
                if (this.game.session.hasStarted) {
                    await this.gamesService.updateHasStarted(this.gameId, false);
                }

                if (this.game.session.currentStoryId) {
                    await this.gamesService.updateCurrentStory(this.gameId, '');
                }
            } else {
                if (this.game.session.currentStoryId && this.game.session.currentStoryId === story.id) {
                    const nextStory = this.game.stories.find((story) => story.index === story.index + 1);
                    const previousStory = this.game.stories.find((story) => story.index === story.index - 1);
                    const newCurrentStoryId = nextStory ? nextStory.id : previousStory.id;

                    await this.gamesService.updateCurrentStory(this.gameId, newCurrentStoryId);
                }

                const newStoriesList = this.game.stories.map((story) => {
                    if (story.index > story.index) {
                        return {
                            ...story,
                            index: story.index - 1,
                        };
                    } else {
                        return story;
                    }
                });

                await this.gamesService.updateStoriesList(this.gameId, newStoriesList);
            }
        } catch (error) {
            this.snackBarService.open(
                this.translocoService.translate('DELETE_STORY_ERROR'),
                this.translocoService.translate(SNACKBAR_ACTION),
                SNACKBAR_CONFIGURATION,
            );

            console.error(error);
        }
    }

    public handleUserMenuRowClick(userId: string, userName: string) {
        if (userId !== this.userId) {
            this.userToRemoveId = userId;

            const removeUserDialogData: RemoveUserDialogDataInterface = {
                userName,
            };

            this.removeUserDialog.data = removeUserDialogData;

            this.removeUserDialog.openDialog();
        }
    }

    public handleRemoveUserDialogConfirmation(removeUserDialogResult: RemoveUserDialogResultInterface) {
        try {
            const userToRemove = this.game.session.users.find((user) => (user.id = this.userToRemoveId));

            if (userToRemove) {
                this.gamesService.updateUsers(this.gameId, userToRemove, 'remove');

                if (removeUserDialogResult.ban) {
                    this.gamesService.updateBannedUsers(this.gameId, this.userToRemoveId, 'add');
                }
            }
        } catch (error) {
            this.snackBarService.open(
                this.translocoService.translate('REMOVE_USER_ERROR'),
                this.translocoService.translate(SNACKBAR_ACTION),
                SNACKBAR_CONFIGURATION,
            );

            console.error(error);
        }
    }

    public async handleResetCardsButtonClick() {
        try {
            const story = this.game.stories.find((story) => story.id === this.currentStoryId);

            delete story.score;

            const newStory: StoryInterface = {
                ...story,
                hasFlippedCards: false,
            };

            const newStoriesList = this.game.stories.map((story) => {
                if (story.id === story.id) {
                    return newStory;
                }

                return story;
            });

            const newVotesList = this.game.session.votes.filter((vote) => vote.storyId !== this.currentStoryId);

            await this.gamesService.updateVotesList(this.gameId, newVotesList);
            await this.gamesService.updateStoriesList(this.gameId, newStoriesList);
        } catch (error) {
            this.handlePromiseError();

            console.error(error);
        }
    }

    public async handleFlipCards() {
        if (this.isHost && !this.hasFlippedCards) {
            try {
                const story = this.game.stories.find((story) => story.id === this.currentStoryId);

                const playersWithValidVote = this.playersWithVoteInfo.filter((player) => player.vote && player.vote.value);

                const voteValues = playersWithValidVote.map((player) => player.vote.value);

                let newScore: number;

                if (this.game.calculateScore) {
                    newScore = this.calculateScore(voteValues);
                }

                const newStory: StoryInterface = {
                    ...story,
                    hasFlippedCards: true,
                };

                if (newScore) {
                    newStory.score = newScore;
                }

                const newStoriesList = this.game.stories.map((story) => {
                    if (story.id === story.id) {
                        return newStory;
                    }

                    return story;
                });

                await this.gamesService.updateStoriesList(this.gameId, newStoriesList);
            } catch (error) {
                this.handlePromiseError();

                console.error(error);
            }
        }
    }

    public async handleFirstStoryButtonClick() {
        try {
            const newCurrentStoryId = this.game.stories.find((story) => story.index === 0).id;

            await this.gamesService.updateCurrentStory(this.gameId, newCurrentStoryId);
        } catch (error) {
            this.handlePromiseError();

            console.error(error);
        }
    }

    public async handleLastStoryButtonClick() {
        try {
            const newCurrentStoryId = this.game.stories.find((story) => story.index === this.game.stories.length - 1).id;

            await this.gamesService.updateCurrentStory(this.gameId, newCurrentStoryId);
        } catch (error) {
            this.handlePromiseError();

            console.error(error);
        }
    }

    public async handlePreviousStoryButtonClick() {
        try {
            const newCurrentStoryId = this.game.stories.find((story) => story.index === this.currentStoryIndex - 1).id;

            await this.gamesService.updateCurrentStory(this.gameId, newCurrentStoryId);
        } catch (error) {
            this.handlePromiseError();

            console.error(error);
        }
    }

    public async handleNextStoryButtonClick() {
        try {
            const newCurrentStoryId = this.game.stories.find((story) => story.index === this.currentStoryIndex + 1).id;

            await this.gamesService.updateCurrentStory(this.gameId, newCurrentStoryId);
        } catch (error) {
            this.handlePromiseError();

            console.error(error);
        }
    }

    public handleEditGameButtonClick() {
        const editGameDialogData: GameDialogDataInterface = {
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
                storyTimerMinutes: this.game.storyTimerMinutes,
            },
            shouldDisplaySaveAndStart: false,
        };

        this.editGameDialog.data = editGameDialogData;

        this.editGameDialog.openDialog();
    }

    public async handleEditGameDialogConfirmation(gameDialogResult: GameDialogResultInterface) {
        try {
            await this.gamesService.updateGame(this.gameId, gameDialogResult.formValue);
        } catch (error) {
            this.snackBarService.open(
                this.translocoService.translate('EDIT_GAME_ERROR'),
                this.translocoService.translate(SNACKBAR_ACTION),
                SNACKBAR_CONFIGURATION,
            );

            console.error(error);
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
    }
}
