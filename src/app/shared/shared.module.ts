import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { DigitOnlyModule } from '@uiowa/digit-only';
import { TranslocoRootModule } from '../transloco-root.module';
import { CardComponent } from './components/card/card.component';
import { ContentLoadingComponent } from './components/content-loading/content-loading.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogContentComponent } from './components/dialog/dialog-content/dialog-content.component';
import { ErrorComponent } from './components/error/error.component';
import { GameCardComponent } from './components/game-card/game-card.component';
import { GameDialogComponent } from './components/game-dialog/game-dialog.component';
import { GameDialogContentComponent } from './components/game-dialog/game-dialog-content/game-dialog-content.component';
import { InviteDialogComponent } from './components/invite-dialog/invite-dialog.component';
import { InviteDialogContentComponent } from './components/invite-dialog/invite-dialog-content/invite-dialog-content.component';
import { LoadingComponent } from './components/loading/loading.component';
import { RemoveUserDialogComponent } from './components/remove-user-dialog/remove-user-dialog.component';
import { RemoveUserDialogContentComponent } from './components/remove-user-dialog/remove-user-dialog-content/remove-user-dialog-content.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SignInCardComponent } from './components/sign-in-card/sign-in-card.component';
import { StoryDialogComponent } from './components/story-dialog/story-dialog.component';
import { StoryDialogContentComponent } from './components/story-dialog/story-dialog-content/story-dialog-content.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { RetrospectivesFragment } from './fragments/retrospectives/retrospectives.fragment';
import { SavedGamesFragment } from './fragments/saved-games/saved-games.fragment';

const components = [
    CardComponent,
    ContentLoadingComponent,
    DialogComponent,
    DialogContentComponent,
    ErrorComponent,
    GameCardComponent,
    GameDialogComponent,
    GameDialogContentComponent,
    InviteDialogComponent,
    InviteDialogContentComponent,
    LoadingComponent,
    RemoveUserDialogComponent,
    RemoveUserDialogContentComponent,
    SidenavComponent,
    SignInCardComponent,
    StoryDialogComponent,
    StoryDialogContentComponent,
    ToolbarComponent,
];

const fragments = [RetrospectivesFragment, SavedGamesFragment];

const modules = [
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

@NgModule({
    declarations: [...components, ...fragments],
    imports: [...modules],
    exports: [...components, ...fragments, ...modules],
})
export class SharedModule {}
