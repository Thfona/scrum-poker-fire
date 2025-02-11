import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState, signInWithPopup, signOut } from '@angular/fire/auth';
import { doc, docData, DocumentReference, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GoogleAuthProvider, UserCredential } from 'firebase/auth';
import { UserInterface } from '../interfaces/user.interface';
import { UserAuthDataInterface } from '../interfaces/user-auth-data.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public user: UserAuthDataInterface;
    public userDocument: Observable<UserInterface>;
    public isSigningIn: boolean;
    public isWaitingPopUp: boolean;
    public routeAfterSignIn = '/home';

    constructor(
        private readonly auth: Auth,
        private readonly firestore: Firestore,
        private readonly router: Router,
    ) {
        this.userDocument = authState(auth).pipe(
            switchMap((user) => {
                if (user) {
                    this.user = user;

                    const userDocument = doc(firestore, `users/${user.uid}`) as DocumentReference<UserInterface>;

                    return docData(userDocument);
                } else {
                    this.user = null;

                    return of(null);
                }
            }),
        );
    }

    public async signIn() {
        this.isSigningIn = true;
        this.isWaitingPopUp = true;

        const authProvider = new GoogleAuthProvider();
        let credential: UserCredential;

        try {
            credential = await signInWithPopup(this.auth, authProvider);
        } catch (error) {
            this.isSigningIn = false;
            this.isWaitingPopUp = false;

            console.error(error);

            return;
        }

        this.isWaitingPopUp = false;

        await this.updateUserData(credential.user);

        this.isSigningIn = false;

        return this.router.navigate([this.routeAfterSignIn]);
    }

    public async signOut() {
        this.routeAfterSignIn = '/home';

        await signOut(this.auth);

        return this.router.navigate(['/auth']);
    }

    private updateUserData({ uid, email, displayName, photoURL }: UserInterface) {
        const userDocument = doc(this.firestore, `users/${uid}`) as DocumentReference<UserInterface>;

        const data = {
            uid,
            email,
            displayName,
            photoURL,
        };

        return setDoc(userDocument, data, { merge: true });
    }
}
