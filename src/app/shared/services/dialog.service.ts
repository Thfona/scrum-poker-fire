import { Injectable } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public currentDialogReference: MatDialogRef<any>;
}
