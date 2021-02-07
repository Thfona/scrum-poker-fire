import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GameInterface } from '../interfaces/game.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private gamesCollection: AngularFirestoreCollection<GameInterface>;
  private games: Observable<GameInterface[]>;

  constructor(private angularFirestore: AngularFirestore, private localStorageService: LocalStorageService) {}

  public getGames() {
    const userId = this.localStorageService.get('userId');

    this.gamesCollection = this.angularFirestore.collection('games', (ref) => {
      return ref.where('ownerId', '==', userId).orderBy('creationDate', 'desc');
    });

    this.games = this.gamesCollection.valueChanges();

    return this.games;
  }
}
