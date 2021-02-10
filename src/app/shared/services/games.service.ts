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
    const gameDocument: AngularFirestoreDocument<GameInterface> = this.angularFirestore.doc(`/games/${gameId}`);

    const game = gameDocument.valueChanges();

    return game;
  }

  public getGames() {
    const userId = this.authService.userId;

    const gamesCollection: AngularFirestoreCollection<GameInterface> = this.angularFirestore.collection(
      'games',
      (ref) => {
        return ref.where('ownerId', '==', userId).orderBy('creationDate', 'desc');
      }
    );

    const games = gamesCollection.valueChanges();

    return games;
  }

  // TODO: Finish implementation
  public createGame(data: FormGameInterface) {
    const id = generateUniqueIdUtil();
    const userId = this.authService.userId;
    const date = dateFormatterUtil(new Date());

    const stories = data.stories.map((story) => {
      return {
        index: story.index,
        name: story.name,
        score: -1
      };
    });

    const game: GameInterface = {
      id,
      ownerId: userId,
      name: data.name,
      description: data.description,
      creationDate: date,
      stories,
      session: {
        isActive: false,
        currentStoryIndex: 0,
        players: [],
        spectators: []
      }
    };

    const gamesCollection: AngularFirestoreCollection<GameInterface> = this.angularFirestore.collection('games');

    // console.log(game)
    // return gamesCollection.doc(id).set(game);
  }

  public updateGame(gameId: string, data: GameInterface) {
    const gameDocument: AngularFirestoreDocument<GameInterface> = this.angularFirestore.doc(`/games/${gameId}`);

    return gameDocument.update(data);
  }

  public deleteGame(gameId: string) {
    const gameDocument: AngularFirestoreDocument<GameInterface> = this.angularFirestore.doc(`/games/${gameId}`);

    return gameDocument.delete();
  }
}
