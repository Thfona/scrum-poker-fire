import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StoryDialogDataInterface } from '../../interfaces/story-dialog-data.interface';
import { StoryDialogResultInterface } from '../../interfaces/story-dialog-result.interface';
import { StoryDialogContentComponent } from './story-dialog-content/story-dialog-content.component';

@Component({
  selector: 'app-story-dialog-component',
  template: ''
})
export class StoryDialogComponent implements OnDestroy {
  @Input() data: StoryDialogDataInterface;
  @Output() confirmEvent = new EventEmitter();
  private dialogSubscription: Subscription;

  constructor(private matDialog: MatDialog) {}

  ngOnDestroy() {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  public openDialog() {
    const DIALOG_REFERENCE = this.matDialog.open(StoryDialogContentComponent, {
      data: this.data,
      autoFocus: false
    });

    this.dialogSubscription = DIALOG_REFERENCE.afterClosed().subscribe((result: StoryDialogResultInterface) => {
      if (result && result.save) {
        this.confirmEvent.emit(result);
      }
    });
  }
}
