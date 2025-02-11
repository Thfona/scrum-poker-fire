import { Injectable } from '@angular/core';
import {
    collection,
    collectionData,
    CollectionReference,
    deleteDoc,
    doc,
    docData,
    DocumentReference,
    Firestore,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from '@angular/fire/firestore';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { FormGameInterface } from '../interfaces/form-game.interface';
import { GameInterface } from '../interfaces/game.interface';
import { GameSessionUserInterface } from '../interfaces/game-session-user.interface';
import { GameVoteInterface } from '../interfaces/game-vote.interface';
import { StoryInterface } from '../interfaces/story.interface';
import { AuthService } from './auth.service';
import { formatDate } from '../utils/format-date.util';
import { generateUniqueId } from '../utils/generate-unique-id.util';

@Injectable()
export class GamesService {
    public latestCreatedGameId: string;

    constructor(
        private readonly firestore: Firestore,
        private readonly authService: AuthService,
    ) {}

    public getGame(gameId: string) {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<GameInterface>;

        const GAME = docData(GAME_DOCUMENT);

        return GAME;
    }

    public getGames() {
        const USER_ID = this.authService.user.uid;

        const GAMES_COLLECTION = collection(this.firestore, 'games') as CollectionReference<GameInterface>;

        const gamesQuery = query(GAMES_COLLECTION, where('ownerId', '==', USER_ID), orderBy('creationDate', 'desc'));

        const GAMES = collectionData(gamesQuery);

        return GAMES;
    }

    public createGame(data: FormGameInterface) {
        const GAME_ID = generateUniqueId();
        const USER_ID = this.authService.user.uid;
        const CREATION_DATE = formatDate(new Date());

        this.latestCreatedGameId = GAME_ID;

        const GAME: GameInterface = {
            ...data,
            id: GAME_ID,
            ownerId: USER_ID,
            creationDate: CREATION_DATE,
            stories: [],
            session: {
                isActive: false,
                hasStarted: false,
                currentStoryId: '',
                users: [],
                votes: [],
            },
            authorizedUsers: [],
            bannedUsers: [],
        };

        return setDoc(doc(this.firestore, 'games', GAME_ID), GAME);
    }

    public updateGame(gameId: string, data: FormGameInterface) {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<GameInterface>;

        return updateDoc(GAME_DOCUMENT, { ...data });
    }

    public deleteGame(gameId: string) {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<GameInterface>;

        return deleteDoc(GAME_DOCUMENT);
    }

    public updateAuthorizedUsers(gameId: string, userId: string, operation: 'add' | 'remove') {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        if (operation === 'add') {
            return updateDoc(GAME_DOCUMENT, { authorizedUsers: arrayUnion(userId) });
        } else {
            return updateDoc(GAME_DOCUMENT, { authorizedUsers: arrayRemove(userId) });
        }
    }

    public updateBannedUsers(gameId: string, userId: string, operation: 'add' | 'remove') {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        if (operation === 'add') {
            return updateDoc(GAME_DOCUMENT, { bannedUsers: arrayUnion(userId) });
        } else {
            return updateDoc(GAME_DOCUMENT, { bannedUsers: arrayRemove(userId) });
        }
    }

    public updateStories(gameId: string, story: StoryInterface, operation: 'add' | 'remove') {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        if (operation === 'add') {
            return updateDoc(GAME_DOCUMENT, { stories: arrayUnion(story) });
        } else {
            return updateDoc(GAME_DOCUMENT, { stories: arrayRemove(story) });
        }
    }

    public updateStoriesList(gameId: string, stories: StoryInterface[]) {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        return updateDoc(GAME_DOCUMENT, { stories });
    }

    public updateIsActive(gameId: string, isActive: boolean) {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        return updateDoc(GAME_DOCUMENT, { 'session.isActive': isActive });
    }

    public updateHasStarted(gameId: string, hasStarted: boolean) {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        return updateDoc(GAME_DOCUMENT, { 'session.hasStarted': hasStarted });
    }

    public updateCurrentStory(gameId: string, currentStoryId: string) {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        return updateDoc(GAME_DOCUMENT, { 'session.currentStoryId': currentStoryId });
    }

    public updateUsers(gameId: string, user: GameSessionUserInterface, operation: 'add' | 'remove') {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        if (operation === 'add') {
            return updateDoc(GAME_DOCUMENT, { 'session.users': arrayUnion(user) });
        } else {
            return updateDoc(GAME_DOCUMENT, { 'session.users': arrayRemove(user) });
        }
    }

    public updateVotes(gameId: string, vote: GameVoteInterface, operation: 'add' | 'remove') {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        if (operation === 'add') {
            return updateDoc(GAME_DOCUMENT, { 'session.votes': arrayUnion(vote) });
        } else {
            return updateDoc(GAME_DOCUMENT, { 'session.votes': arrayRemove(vote) });
        }
    }

    public updateVotesList(gameId: string, votes: GameVoteInterface[]) {
        const GAME_DOCUMENT = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

        return updateDoc(GAME_DOCUMENT, { 'session.votes': votes });
    }
}
