import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataInterface } from '../../interfaces/dialog-data.interface';

@Component({
  selector: 'app-dialog-component',
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  @Input() data: DialogDataInterface;
  @Output() confirmEvent = new EventEmitter();

  constructor(private matDialog: MatDialog) {}

  public openDialog() {
    const dialogReference = this.matDialog.open(DialogContentComponent, {
      data: this.data,
      autoFocus: false
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmEvent.emit();
      }
    });
  }
}

@Component({
  selector: 'app-dialog-content-component',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss']
})
export class DialogContentComponent {
  public cancelButtonDefaultTextCode = 'CANCEL';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDataInterface) {}

  public getConfirmButtonClasses() {
    const classes: string[] = ['confirm-button'];

    classes.push(`confirm-button--${this.data.confirmButtonColor}`);

    return classes;
  }
}
