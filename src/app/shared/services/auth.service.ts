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
  public userDocument: Observable<UserInterface>;
  public isSigningIn: boolean;
  public isWaitingPopUp: boolean;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router
  ) {
    this.userDocument = this.angularFireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.angularFirestore.doc<UserInterface>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  public async signIn() {
    this.isSigningIn = true;
    this.isWaitingPopUp = true;

    const provider = new firebase.auth.GoogleAuthProvider();
    let credential: firebase.auth.UserCredential;

    try {
      credential = await this.angularFireAuth.signInWithPopup(provider);
    } catch {
      this.isSigningIn = false;
      this.isWaitingPopUp = false;
      return;
    }

    this.isWaitingPopUp = false;

    await this.router.navigate(['/home']);

    this.isSigningIn = false;

    return this.updateUserData(credential.user);
  }

  public async signOut() {
    await this.angularFireAuth.signOut();

    return this.router.navigate(['/auth']);
  }

  private updateUserData({ uid, email, displayName, photoURL }: UserInterface) {
    const userReference: AngularFirestoreDocument<UserInterface> = this.angularFirestore.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL
    };

    return userReference.set(data, { merge: true });
  }
}
