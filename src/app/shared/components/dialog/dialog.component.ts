import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogDataInterface } from '../../interfaces/dialog-data.interface';
import { DialogContentComponent } from './dialog-content/dialog-content.component';

@Component({
  selector: 'app-dialog-component',
  template: ''
})
export class DialogComponent {
  @Input() data: DialogDataInterface;
  @Output() confirmEvent = new EventEmitter();

  constructor(private matDialog: MatDialog) {}

  public openDialog() {
    const DIALOG_REFERENCE = this.matDialog.open(DialogContentComponent, {
      data: this.data,
      autoFocus: false
    });

    DIALOG_REFERENCE.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmEvent.emit();
      }
    });
  }
}
