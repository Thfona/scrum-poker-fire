import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';
import { SNACKBAR_ACTION } from 'src/app/shared/constants/snackbar-action.constant';
import { SNACKBAR_CONFIGURATION } from 'src/app/shared/constants/snackbar-configuration.constant';

@Component({
  selector: 'app-invite-dialog-content-component',
  templateUrl: './invite-dialog-content.component.html',
  styleUrls: ['./invite-dialog-content.component.scss']
})
export class InviteDialogContentComponent {
  @ViewChild('linkInput') linkInput: ElementRef;

  constructor(private snackBar: MatSnackBar, private translocoService: TranslocoService) {}

  public getGameUrl() {
    return window.location.href;
  }

  public copyLinkToClipboard() {
    const INPUT: HTMLInputElement = this.linkInput.nativeElement;

    INPUT.select();
    document.execCommand('copy');
    INPUT.setSelectionRange(0, 0);

    this.snackBar.open(
      this.translocoService.translate('LINK_COPIED_MESSAGE'),
      this.translocoService.translate(SNACKBAR_ACTION),
      SNACKBAR_CONFIGURATION
    );
  }
}
