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
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<GameInterface>;

    const game = docData(gameDocument);

    return game;
  }

  public getGames() {
    const userId = this.authService.user.uid;

    const gamesCollection = collection(this.firestore, 'games') as CollectionReference<GameInterface>;

    const gamesQuery = query(gamesCollection, where('ownerId', '==', userId), orderBy('creationDate', 'desc'));

    const games = collectionData(gamesQuery);

    return games;
  }

  public createGame(data: FormGameInterface) {
    const gameId = generateUniqueId();
    const userId = this.authService.user.uid;
    const creationDate = formatDate(new Date());

    this.latestCreatedGameId = gameId;

    const game: GameInterface = {
      ...data,
      id: gameId,
      ownerId: userId,
      creationDate: creationDate,
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

    return setDoc(doc(this.firestore, 'games', gameId), game);
  }

  public updateGame(gameId: string, data: FormGameInterface) {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<GameInterface>;

    return updateDoc(gameDocument, { ...data });
  }

  public deleteGame(gameId: string) {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<GameInterface>;

    return deleteDoc(gameDocument);
  }

  public updateAuthorizedUsers(gameId: string, userId: string, operation: 'add' | 'remove') {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    if (operation === 'add') {
      return updateDoc(gameDocument, { authorizedUsers: arrayUnion(userId) });
    } else {
      return updateDoc(gameDocument, { authorizedUsers: arrayRemove(userId) });
    }
  }

  public updateBannedUsers(gameId: string, userId: string, operation: 'add' | 'remove') {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    if (operation === 'add') {
      return updateDoc(gameDocument, { bannedUsers: arrayUnion(userId) });
    } else {
      return updateDoc(gameDocument, { bannedUsers: arrayRemove(userId) });
    }
  }

  public updateStories(gameId: string, story: StoryInterface, operation: 'add' | 'remove') {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    if (operation === 'add') {
      return updateDoc(gameDocument, { stories: arrayUnion(story) });
    } else {
      return updateDoc(gameDocument, { stories: arrayRemove(story) });
    }
  }

  public updateStoriesList(gameId: string, stories: StoryInterface[]) {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    return updateDoc(gameDocument, { stories });
  }

  public updateIsActive(gameId: string, isActive: boolean) {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    return updateDoc(gameDocument, { 'session.isActive': isActive });
  }

  public updateHasStarted(gameId: string, hasStarted: boolean) {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    return updateDoc(gameDocument, { 'session.hasStarted': hasStarted });
  }

  public updateCurrentStory(gameId: string, currentStoryId: string) {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    return updateDoc(gameDocument, { 'session.currentStoryId': currentStoryId });
  }

  public updateUsers(gameId: string, user: GameSessionUserInterface, operation: 'add' | 'remove') {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    if (operation === 'add') {
      return updateDoc(gameDocument, { 'session.users': arrayUnion(user) });
    } else {
      return updateDoc(gameDocument, { 'session.users': arrayRemove(user) });
    }
  }

  public updateVotes(gameId: string, vote: GameVoteInterface, operation: 'add' | 'remove') {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    if (operation === 'add') {
      return updateDoc(gameDocument, { 'session.votes': arrayUnion(vote) });
    } else {
      return updateDoc(gameDocument, { 'session.votes': arrayRemove(vote) });
    }
  }

  public updateVotesList(gameId: string, votes: GameVoteInterface[]) {
    const gameDocument = doc(this.firestore, `/games/${gameId}`) as DocumentReference<any>;

    return updateDoc(gameDocument, { 'session.votes': votes });
  }
}
