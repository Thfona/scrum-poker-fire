import { Component, OnDestroy } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Subscription } from 'rxjs';
import { InviteDialogContentComponent } from './invite-dialog-content/invite-dialog-content.component';

@Component({
  selector: 'app-invite-dialog-component',
  template: '',
})
export class InviteDialogComponent implements OnDestroy {
  private dialogSubscription: Subscription;

  constructor(private matDialog: MatDialog) {}

  ngOnDestroy() {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  public openDialog() {
    const DIALOG_REFERENCE = this.matDialog.open(InviteDialogContentComponent, {
      autoFocus: false,
    });

    this.dialogSubscription = DIALOG_REFERENCE.afterClosed().subscribe();
  }
}
