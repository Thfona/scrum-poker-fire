import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { TranslocoRootModule } from '../transloco-root.module';
import { CardComponent } from './components/card/card.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogContentComponent } from './components/dialog/dialog-content/dialog-content.component';
import { ErrorComponent } from './components/error/error.component';
import { GameCardComponent } from './components/game-card/game-card.component';
import { GameDialogComponent } from './components/game-dialog/game-dialog.component';
import { GameDialogContentComponent } from './components/game-dialog/game-dialog-content/game-dialog-content.component';
import { InviteDialogComponent } from './components/invite-dialog/invite-dialog.component';
import { InviteDialogContentComponent } from './components/invite-dialog/invite-dialog-content/invite-dialog-content.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SignInCardComponent } from './components/sign-in-card/sign-in-card.component';
import { StoryDialogComponent } from './components/story-dialog/story-dialog.component';
import { StoryDialogContentComponent } from './components/story-dialog/story-dialog-content/story-dialog-content.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { RetrospectivesFragment } from './fragments/retrospectives/retrospectives.fragment';
import { SavedGamesFragment } from './fragments/saved-games/saved-games.fragment';

const COMPONENTS = [
  CardComponent,
  DialogComponent,
  DialogContentComponent,
  ErrorComponent,
  GameCardComponent,
  GameDialogComponent,
  GameDialogContentComponent,
  InviteDialogComponent,
  InviteDialogContentComponent,
  LoadingComponent,
  SidenavComponent,
  SignInCardComponent,
  StoryDialogComponent,
  StoryDialogContentComponent,
  ToolbarComponent,
];

const FRAGMENTS = [RetrospectivesFragment, SavedGamesFragment];

const MODULES = [
  CommonModule,
  DigitOnlyModule,
  FormsModule,
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
  ReactiveFormsModule,
  RouterModule,
  TranslocoRootModule,
];

const SERVICES = [];

@NgModule({
  declarations: [...COMPONENTS, ...FRAGMENTS],
  imports: [...MODULES],
  exports: [...COMPONENTS, ...FRAGMENTS, ...MODULES],
  providers: [...SERVICES],
})
export class SharedModule {}
