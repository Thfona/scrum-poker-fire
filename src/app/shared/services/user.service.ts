import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
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

  constructor(private angularFirestore: AngularFirestore, private authService: AuthService) {}

  public updateUserDefaultGameSettings(gameSettings: GameSettingsInterface) {
    const USER_ID = this.authService.user.uid;

    const USER_DOCUMENT: AngularFirestoreDocument<UserInterface> = this.angularFirestore.doc(`/users/${USER_ID}`);

    this.defaultGameSettings = gameSettings;

    return USER_DOCUMENT.update({ defaultGameSettings: gameSettings });
  }

  public deleteUserAccount() {
    const USER_ID = this.authService.user.uid;

    const USER_DOCUMENT: AngularFirestoreDocument<UserInterface> = this.angularFirestore.doc(`/users/${USER_ID}`);

    return USER_DOCUMENT.delete();
  }
}
