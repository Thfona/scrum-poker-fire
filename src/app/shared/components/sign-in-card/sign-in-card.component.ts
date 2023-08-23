import { Component } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SNACKBAR_ACTION } from '../../constants/snackbar-action.constant';
import { SNACKBAR_CONFIGURATION } from '../../constants/snackbar-configuration.constant';

@Component({
  selector: 'app-sign-in-card-component',
  templateUrl: './sign-in-card.component.html',
  styleUrls: ['./sign-in-card.component.scss'],
})
export class SignInCardComponent {
  constructor(
    public authService: AuthService,
    private snackBarService: MatSnackBar,
    private translocoService: TranslocoService,
  ) {}

  public async signIn() {
    try {
      await this.authService.signIn();
    } catch (error) {
      this.snackBarService.open(
        this.translocoService.translate('SIGN_IN_ERROR'),
        this.translocoService.translate(SNACKBAR_ACTION),
        SNACKBAR_CONFIGURATION,
      );

      console.error(error);
    }
  }
}
