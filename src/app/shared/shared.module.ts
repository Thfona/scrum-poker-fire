import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { TranslocoRootModule } from '../transloco-root.module';

import { MainLayout } from './layouts/main/main.layout';
import { EmptyLayout } from './layouts/empty/empty.layout';

import { SignInCardComponent } from './components/sign-in-card/sign-in-card.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

const COMPONENTS = [SignInCardComponent, ToolbarComponent];

const LAYOUTS = [MainLayout, EmptyLayout];

const MODULES = [
  AngularFirestoreModule,
  BrowserAnimationsModule,
  CommonModule,
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatRippleModule,
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
