import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormGameInterface } from '../interfaces/form-game.interface';
import { GameInterface } from '../interfaces/game.interface';
import { AuthService } from './auth.service';
import { dateFormatterUtil } from '../utils/dateFormatter.util';
import { generateUniqueIdUtil } from '../utils/generateUniqueId.util';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  constructor(private angularFirestore: AngularFirestore, private authService: AuthService) {}

  public getGame(gameId: string) {
    const GAME_DOCUMENT: AngularFirestoreDocument<GameInterface> = this.angularFirestore.doc(`/games/${gameId}`);

    const GAME = GAME_DOCUMENT.valueChanges();

    return GAME;
  }

  public getGames() {
    const USER_ID = this.authService.userId;

    const GAMES_COLLECTION: AngularFirestoreCollection<GameInterface> = this.angularFirestore.collection(
      'games',
      (ref) => {
        return ref.where('ownerId', '==', USER_ID).orderBy('creationDate', 'desc');
      }
    );

    const GAMES = GAMES_COLLECTION.valueChanges();

    return GAMES;
  }

  // TODO: Finish implementation
  public createGame(data: FormGameInterface) {
    const GAME_ID = generateUniqueIdUtil();
    const USER_ID = this.authService.userId;
    const CREATION_DATE = dateFormatterUtil(new Date());

    const GAME: GameInterface = {
      ...data,
      id: GAME_ID,
      ownerId: USER_ID,
      creationDate: CREATION_DATE,
      stories: [],
      session: {
        isActive: false,
        currentStoryIndex: 0,
        players: [],
        spectators: []
      },
      bannedPlayers: []
    };

    const GAMES_COLLECTION: AngularFirestoreCollection<GameInterface> = this.angularFirestore.collection('games');

    // console.log(game)
    // return gamesCollection.doc(id).set(game);
  }

  public updateGame(gameId: string, data: FormGameInterface) {
    const GAME_DOCUMENT: AngularFirestoreDocument<GameInterface> = this.angularFirestore.doc(`/games/${gameId}`);

    return GAME_DOCUMENT.update({ ...data });
  }

  public deleteGame(gameId: string) {
    const GAME_DOCUMENT: AngularFirestoreDocument<GameInterface> = this.angularFirestore.doc(`/games/${gameId}`);

    return GAME_DOCUMENT.delete();
  }
}
