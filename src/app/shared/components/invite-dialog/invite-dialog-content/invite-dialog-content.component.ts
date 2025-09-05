import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { SNACKBAR_ACTION } from 'src/app/shared/constants/snackbar-action.constant';
import { SNACKBAR_CONFIGURATION } from 'src/app/shared/constants/snackbar-configuration.constant';

@Component({
  selector: 'app-invite-dialog-content-component',
  templateUrl: './invite-dialog-content.component.html',
  styleUrls: ['./invite-dialog-content.component.scss'],
  standalone: false,
})
export class InviteDialogContentComponent {
    @ViewChild('linkInput') linkInput: ElementRef;

    public get gameUrl() {
      return window.location.href;
    }

    constructor(
        private readonly snackBarService: MatSnackBar,
        private readonly translocoService: TranslocoService,
    ) {}

    public handleLinkInputClick() {
      const input: HTMLInputElement = this.linkInput.nativeElement;

      input.select();
    }

    public copyLinkToClipboard() {
      navigator.clipboard.writeText(this.gameUrl);

      this.snackBarService.open(
        this.translocoService.translate('LINK_COPIED_MESSAGE'),
        this.translocoService.translate(SNACKBAR_ACTION),
        SNACKBAR_CONFIGURATION,
      );
    }
}
