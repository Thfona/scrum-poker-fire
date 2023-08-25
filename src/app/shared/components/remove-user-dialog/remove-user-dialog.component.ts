import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Subscription } from 'rxjs';
import { RemoveUserDialogDataInterface } from '../../interfaces/remove-user-dialog-data.interface';
import { RemoveUserDialogResultInterface } from '../../interfaces/remove-user-dialog-result.interface';
import { RemoveUserDialogContentComponent } from './remove-user-dialog-content/remove-user-dialog-content.component';

@Component({
  selector: 'app-remove-user-dialog-component',
  template: '',
})
export class RemoveUserDialogComponent implements OnDestroy {
  @Input() data: RemoveUserDialogDataInterface;
  @Output() confirmEvent = new EventEmitter();
  private dialogSubscription: Subscription;

  constructor(private readonly matDialog: MatDialog) {}

  ngOnDestroy() {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  public openDialog() {
    const DIALOG_REFERENCE = this.matDialog.open(RemoveUserDialogContentComponent, {
      data: this.data,
      autoFocus: false,
    });

    this.dialogSubscription = DIALOG_REFERENCE.afterClosed().subscribe((result: RemoveUserDialogResultInterface) => {
      if (result?.remove) {
        this.confirmEvent.emit(result);
      }
    });
  }
}
