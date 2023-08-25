import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { FormGameInterface } from '../interfaces/form-game.interface';
import { GameInterface } from '../interfaces/game.interface';
import { GameSessionUserInterface } from '../interfaces/game-session-user.interface';
import { GameVoteInterface } from '../interfaces/game-vote.interface';
import { StoryInterface } from '../interfaces/story.interface';
import { AuthService } from './auth.service';
import { dateFormatterUtil } from '../utils/dateFormatter.util';
import { generateUniqueIdUtil } from '../utils/generateUniqueId.util';

@Injectable()
export class GamesService {
  public latestCreatedGameId: string;

  constructor(private readonly angularFirestore: AngularFirestore, private readonly authService: AuthService) {}

  public getGame(gameId: string) {
    const GAME_DOCUMENT: AngularFirestoreDocument<GameInterface> = this.angularFirestore.doc(`/games/${gameId}`);

    const GAME = GAME_DOCUMENT.valueChanges();

    return GAME;
  }

  public getGames() {
    const USER_ID = this.authService.user.uid;

    const GAMES_COLLECTION: AngularFirestoreCollection<GameInterface> = this.angularFirestore.collection(
      'games',
      (ref) => {
        return ref.where('ownerId', '==', USER_ID).orderBy('creationDate', 'desc');
      },
    );

    const GAMES = GAMES_COLLECTION.valueChanges();

    return GAMES;
  }

  public createGame(data: FormGameInterface) {
    const GAME_ID = generateUniqueIdUtil();
    const USER_ID = this.authService.user.uid;
    const CREATION_DATE = dateFormatterUtil(new Date());

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

    const GAMES_COLLECTION: AngularFirestoreCollection<GameInterface> = this.angularFirestore.collection('games');

    return GAMES_COLLECTION.doc(GAME_ID).set(GAME);
  }

  public updateGame(gameId: string, data: FormGameInterface) {
    const GAME_DOCUMENT: AngularFirestoreDocument<GameInterface> = this.angularFirestore.doc(`/games/${gameId}`);

    return GAME_DOCUMENT.update({ ...data });
  }

  public deleteGame(gameId: string) {
    const GAME_DOCUMENT: AngularFirestoreDocument<GameInterface> = this.angularFirestore.doc(`/games/${gameId}`);

    return GAME_DOCUMENT.delete();
  }

  public updateAuthorizedUsers(gameId: string, userId: string, operation: 'add' | 'remove') {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    if (operation === 'add') {
      return GAME_DOCUMENT.update({ authorizedUsers: firebase.firestore.FieldValue.arrayUnion(userId) });
    } else {
      return GAME_DOCUMENT.update({ authorizedUsers: firebase.firestore.FieldValue.arrayRemove(userId) });
    }
  }

  public updateBannedUsers(gameId: string, userId: string, operation: 'add' | 'remove') {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    if (operation === 'add') {
      return GAME_DOCUMENT.update({ bannedUsers: firebase.firestore.FieldValue.arrayUnion(userId) });
    } else {
      return GAME_DOCUMENT.update({ bannedUsers: firebase.firestore.FieldValue.arrayRemove(userId) });
    }
  }

  public updateStories(gameId: string, story: StoryInterface, operation: 'add' | 'remove') {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    if (operation === 'add') {
      return GAME_DOCUMENT.update({ stories: firebase.firestore.FieldValue.arrayUnion(story) });
    } else {
      return GAME_DOCUMENT.update({ stories: firebase.firestore.FieldValue.arrayRemove(story) });
    }
  }

  public updateStoriesList(gameId: string, stories: StoryInterface[]) {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    return GAME_DOCUMENT.update({ stories });
  }

  public updateIsActive(gameId: string, isActive: boolean) {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    return GAME_DOCUMENT.update({ 'session.isActive': isActive });
  }

  public updateHasStarted(gameId: string, hasStarted: boolean) {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    return GAME_DOCUMENT.update({ 'session.hasStarted': hasStarted });
  }

  public updateCurrentStory(gameId: string, currentStoryId: string) {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    return GAME_DOCUMENT.update({ 'session.currentStoryId': currentStoryId });
  }

  public updateUsers(gameId: string, user: GameSessionUserInterface, operation: 'add' | 'remove') {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    if (operation === 'add') {
      return GAME_DOCUMENT.update({ 'session.users': firebase.firestore.FieldValue.arrayUnion(user) });
    } else {
      return GAME_DOCUMENT.update({ 'session.users': firebase.firestore.FieldValue.arrayRemove(user) });
    }
  }

  public updateVotes(gameId: string, vote: GameVoteInterface, operation: 'add' | 'remove') {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    if (operation === 'add') {
      return GAME_DOCUMENT.update({ 'session.votes': firebase.firestore.FieldValue.arrayUnion(vote) });
    } else {
      return GAME_DOCUMENT.update({ 'session.votes': firebase.firestore.FieldValue.arrayRemove(vote) });
    }
  }

  public updateVotesList(gameId: string, votes: GameVoteInterface[]) {
    const GAME_DOCUMENT: AngularFirestoreDocument<any> = this.angularFirestore.doc(`/games/${gameId}`);

    return GAME_DOCUMENT.update({ 'session.votes': votes });
  }
}
