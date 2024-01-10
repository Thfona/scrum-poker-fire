import { Component, Input, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogDataInterface } from '../../interfaces/dialog-data.interface';
import { UserInterface } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { DialogComponent } from '../dialog/dialog.component';
import { SNACKBAR_ACTION } from '../../constants/snackbar-action.constant';
import { SNACKBAR_CONFIGURATION } from '../../constants/snackbar-configuration.constant';

@Component({
  selector: 'app-toolbar-component',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @ViewChild('deleteAccountDialog') deleteAccountDialog: DialogComponent;
  @Input() user: UserInterface;
  public gitHubRepositoryLink = 'https://github.com/Thfona/scrum-poker-fire-frontend';

  constructor(
    private readonly userService: UserService,
    private readonly snackBarService: MatSnackBar,
    private readonly translocoService: TranslocoService,
    public readonly authService: AuthService,
  ) {}

  public openGitHubRepository() {
    window.open(this.gitHubRepositoryLink, '_blank');
  }

  public handleDeleteAccountClick() {
    const DELETE_ACCOUNT_DIALOG_DATA: DialogDataInterface = {
      title: this.translocoService.translate('DELETE_ACCOUNT'),
      content: this.translocoService.translate('DELETE_ACCOUNT_CONTENT'),
      confirmButtonText: this.translocoService.translate('DELETE_ACCOUNT_BUTTON_TEXT'),
      confirmButtonColor: 'warn',
    };

    this.deleteAccountDialog.data = DELETE_ACCOUNT_DIALOG_DATA;

    this.deleteAccountDialog.openDialog();
  }

  public handleDeleteAccountDialogConfirmation() {
    try {
      this.userService.deleteUserAccount();

      this.authService.signOut();
    } catch (error) {
      this.snackBarService.open(
        this.translocoService.translate('DELETE_ACCOUNT_ERROR'),
        this.translocoService.translate(SNACKBAR_ACTION),
        SNACKBAR_CONFIGURATION,
      );

      console.error(error);

      return;
    }

    this.snackBarService.open(
      this.translocoService.translate('DELETE_ACCOUNT_SUCCESS'),
      this.translocoService.translate(SNACKBAR_ACTION),
      SNACKBAR_CONFIGURATION,
    );
  }
}
