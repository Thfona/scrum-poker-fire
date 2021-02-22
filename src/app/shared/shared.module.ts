import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { TranslocoRootModule } from '../transloco-root.module';
import { CardComponent } from './components/card/card.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogContentComponent } from './components/dialog/dialog-content/dialog-content.component';
import { ErrorComponent } from './components/error/error.component';
import { GameDialogComponent } from './components/game-dialog/game-dialog.component';
import { GameDialogContentComponent } from './components/game-dialog/game-dialog-content/game-dialog-content.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SignInCardComponent } from './components/sign-in-card/sign-in-card.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

const COMPONENTS = [
  CardComponent,
  DialogComponent,
  DialogContentComponent,
  ErrorComponent,
  GameDialogComponent,
  GameDialogContentComponent,
  LoadingComponent,
  SidenavComponent,
  SignInCardComponent,
  ToolbarComponent
];

const MODULES = [
  AngularFirestoreModule,
  BrowserAnimationsModule,
  CommonModule,
  DigitOnlyModule,
  FormsModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
  RouterModule,
  TranslocoRootModule
];

const SERVICES = [];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES],
  exports: [...COMPONENTS, ...MODULES],
  providers: [...SERVICES]
})
export class SharedModule {}
