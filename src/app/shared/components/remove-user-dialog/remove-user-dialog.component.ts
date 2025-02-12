import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RemoveUserDialogDataInterface } from '../../interfaces/remove-user-dialog-data.interface';
import { RemoveUserDialogResultInterface } from '../../interfaces/remove-user-dialog-result.interface';
import { RemoveUserDialogContentComponent } from './remove-user-dialog-content/remove-user-dialog-content.component';

@Component({
    selector: 'app-remove-user-dialog-component',
    template: '',
    standalone: false,
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
      const dialogReference = this.matDialog.open(RemoveUserDialogContentComponent, {
          data: this.data,
          autoFocus: false,
      });

      this.dialogSubscription = dialogReference.afterClosed().subscribe((result: RemoveUserDialogResultInterface) => {
          if (result?.remove) {
              this.confirmEvent.emit(result);
          }
      });
  }
}
