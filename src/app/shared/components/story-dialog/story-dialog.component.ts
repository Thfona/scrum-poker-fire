import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StoryDialogDataInterface } from '../../interfaces/story-dialog-data.interface';
import { StoryDialogResultInterface } from '../../interfaces/story-dialog-result.interface';
import { DialogService } from '../../services/dialog.service';
import { StoryDialogContentComponent } from './story-dialog-content/story-dialog-content.component';

@Component({
    selector: 'app-story-dialog-component',
    template: '',
    standalone: false,
})
export class StoryDialogComponent implements OnDestroy {
  @Input() data: StoryDialogDataInterface;
  @Output() confirmEvent = new EventEmitter();
  private dialogSubscription: Subscription;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly dialogService: DialogService,
  ) {}

  ngOnDestroy() {
      if (this.dialogSubscription) {
          this.dialogSubscription.unsubscribe();
      }
  }

  public openDialog() {
      const DIALOG_REFERENCE = this.matDialog.open(StoryDialogContentComponent, {
          data: this.data,
          autoFocus: false,
          minWidth: '430px',
      });

      this.dialogService.currentDialogReference = DIALOG_REFERENCE;

      this.dialogSubscription = DIALOG_REFERENCE.afterClosed().subscribe((result: StoryDialogResultInterface) => {
          this.dialogService.currentDialogReference = undefined;

          if (result?.save || result?.goTo) {
              this.confirmEvent.emit(result);
          }
      });
  }
}
