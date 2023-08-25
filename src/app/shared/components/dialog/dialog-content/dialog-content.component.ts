import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DialogDataInterface } from 'src/app/shared/interfaces/dialog-data.interface';

@Component({
  selector: 'app-dialog-content-component',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
})
export class DialogContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: DialogDataInterface) {}
}
