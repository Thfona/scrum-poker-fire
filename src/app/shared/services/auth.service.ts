import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userDocument: Observable<UserInterface>;

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
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.angularFireAuth.signInWithPopup(provider);

    this.router.navigate(['/home']);

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
