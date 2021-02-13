import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userId: string;
  public userDocument: Observable<UserInterface>;
  public isSigningIn: boolean;
  public isWaitingPopUp: boolean;
  public routeAfterSignIn = '/home';

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router
  ) {
    this.userDocument = this.angularFireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.userId = user.uid;
          return this.angularFirestore.doc<UserInterface>(`users/${user.uid}`).valueChanges();
        } else {
          this.userId = null;
          return of(null);
        }
      })
    );
  }

  public async signIn() {
    this.isSigningIn = true;
    this.isWaitingPopUp = true;

    const PROVIDER = new firebase.auth.GoogleAuthProvider();
    let credential: firebase.auth.UserCredential;

    try {
      credential = await this.angularFireAuth.signInWithPopup(PROVIDER);
    } catch {
      this.isSigningIn = false;
      this.isWaitingPopUp = false;
      return;
    }

    this.isWaitingPopUp = false;

    await this.router.navigate([this.routeAfterSignIn]);

    this.isSigningIn = false;

    return this.updateUserData(credential.user);
  }

  public async signOut() {
    this.routeAfterSignIn = '/home';

    await this.angularFireAuth.signOut();

    return this.router.navigate(['/auth']);
  }

  private updateUserData({ uid, email, displayName, photoURL }: UserInterface) {
    const USER_REFERENCE: AngularFirestoreDocument<UserInterface> = this.angularFirestore.doc(`users/${uid}`);

    const DATA = {
      uid,
      email,
      displayName,
      photoURL
    };

    return USER_REFERENCE.set(DATA, { merge: true });
  }
}
