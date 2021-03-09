import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DomainInterface } from '../interfaces/domain-interface';
import { DomainItemInterface } from '../interfaces/domain-item.interface';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private domain: any;

  public getDomain(): DomainInterface {
    return this.domain;
  }

  public setDomain(values: DomainItemInterface[]) {
    this.domain = Object.assign({}, ...values.map((item) => ({ [item.id]: item })));
  }

  constructor(private angularFirestore: AngularFirestore) {}

  public getDomainItems() {
    const DOMAIN_COLLECTION: AngularFirestoreCollection<DomainItemInterface> = this.angularFirestore.collection(
      'domain'
    );

    const DOMAIN = DOMAIN_COLLECTION.valueChanges();

    return DOMAIN;
  }
}
