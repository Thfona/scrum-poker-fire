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
        const USER_ID = this.authService.user.uid;

        const USER_DOCUMENT = doc(this.angularFirestore, `/users/${USER_ID}`) as DocumentReference<UserInterface>;

        this.defaultGameSettings = gameSettings;

        return updateDoc(USER_DOCUMENT, { defaultGameSettings: gameSettings });
    }

    public deleteUserAccount() {
        const USER_ID = this.authService.user.uid;

        const USER_DOCUMENT = doc(this.angularFirestore, `/users/${USER_ID}`) as DocumentReference<UserInterface>;

        return deleteDoc(USER_DOCUMENT);
    }
}
