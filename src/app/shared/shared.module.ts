import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { TranslocoRootModule } from '../transloco-root.module';
import { environment } from 'src/environments/environment';

import { MainLayout } from './layouts/main/main.layout';
import { EmptyLayout } from './layouts/empty/empty.layout';

const COMPONENTS = [];

const LAYOUTS = [MainLayout, EmptyLayout];

const MODULES = [
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFirestoreModule,
  BrowserAnimationsModule,
  CommonModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  RouterModule,
  TranslocoRootModule
];

const SERVICES = [];

@NgModule({
  declarations: [...COMPONENTS, ...LAYOUTS],
  imports: [...MODULES],
  exports: [...COMPONENTS, ...MODULES],
  providers: [...SERVICES]
})
export class SharedModule {}
