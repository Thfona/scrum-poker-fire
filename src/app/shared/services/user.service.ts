import { Injectable } from '@angular/core';
import { deleteDoc, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { GameSettingsInterface } from '../interfaces/game-settings.interface';
import { UserInterface } from '../interfaces/user.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private defaultGameSettings: GameSettingsInterface;

  get defaultGameSettingsState() {
    return this.defaultGameSettings;
  }

  set defaultGameSettingsState(value: GameSettingsInterface) {
    this.defaultGameSettings = value;
  }

  constructor(
        private readonly angularFirestore: Firestore,
        private readonly authService: AuthService,
  ) {}

  public updateUserDefaultGameSettings(gameSettings: GameSettingsInterface) {
    const userId = this.authService.user.uid;

    const userDocument = doc(this.angularFirestore, `/users/${userId}`) as DocumentReference<UserInterface>;

    this.defaultGameSettings = gameSettings;

    return updateDoc(userDocument, { defaultGameSettings: gameSettings });
  }

  public deleteUserAccount() {
    const userId = this.authService.user.uid;

    const userDocument = doc(this.angularFirestore, `/users/${userId}`) as DocumentReference<UserInterface>;

    return deleteDoc(userDocument);
  }
}
