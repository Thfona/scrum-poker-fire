import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { SNACKBAR_ACTION } from 'src/app/shared/constants/snackbar-action.constant';
import { SNACKBAR_CONFIGURATION } from 'src/app/shared/constants/snackbar-configuration.constant';

@Component({
  selector: 'app-invite-dialog-content-component',
  templateUrl: './invite-dialog-content.component.html',
  styleUrls: ['./invite-dialog-content.component.scss'],
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
    const INPUT: HTMLInputElement = this.linkInput.nativeElement;

    INPUT.select();
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
