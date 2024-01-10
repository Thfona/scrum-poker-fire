import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RemoveUserDialogDataInterface } from 'src/app/shared/interfaces/remove-user-dialog-data.interface';
import { RemoveUserDialogResultInterface } from 'src/app/shared/interfaces/remove-user-dialog-result.interface';

@Component({
  selector: 'app-remove-user-dialog-content-component',
  templateUrl: './remove-user-dialog-content.component.html',
  styleUrls: ['./remove-user-dialog-content.component.scss'],
})
export class RemoveUserDialogContentComponent {
  public cancelResult: RemoveUserDialogResultInterface = {
    remove: false,
    ban: false,
  };
  public removeResult: RemoveUserDialogResultInterface = {
    remove: true,
    ban: false,
  };
  public removeAndBanResult: RemoveUserDialogResultInterface = {
    remove: true,
    ban: true,
  };

  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: RemoveUserDialogDataInterface) {}
}
