import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
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
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router,
  ) {
    this.userDocument = this.angularFireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.user = user;

          return this.angularFirestore.doc<UserInterface>(`users/${user.uid}`).valueChanges();
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

    const PROVIDER = new firebase.auth.GoogleAuthProvider();
    let credential: firebase.auth.UserCredential;

    try {
      credential = await this.angularFireAuth.signInWithPopup(PROVIDER);
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

    await this.angularFireAuth.signOut();

    return this.router.navigate(['/auth']);
  }

  private updateUserData({ uid, email, displayName, photoURL }: UserInterface) {
    const USER_DOCUMENT: AngularFirestoreDocument<UserInterface> = this.angularFirestore.doc(`users/${uid}`);

    const DATA = {
      uid,
      email,
      displayName,
      photoURL,
    };

    return USER_DOCUMENT.set(DATA, { merge: true });
  }
}
