import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GameDialogDataInterface } from '../../interfaces/game-dialog-data.interface';
import { GameDialogResultInterface } from '../../interfaces/game-dialog-result.interface';
import { DomainService } from '../../services/domain.service';
import { GameDialogContentComponent } from './game-dialog-content/game-dialog-content.component';

@Component({
  selector: 'app-game-dialog-component',
  template: ''
})
export class GameDialogComponent implements OnDestroy {
  @Input() data: GameDialogDataInterface;
  @Output() confirmEvent = new EventEmitter();
  private dialogSubscription: Subscription;

  constructor(private matDialog: MatDialog, private domainService: DomainService) {}

  ngOnDestroy() {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  public openDialog() {
    const DIALOG_REFERENCE = this.matDialog.open(GameDialogContentComponent, {
      data: this.data,
      autoFocus: false
    });

    this.dialogSubscription = DIALOG_REFERENCE.afterClosed().subscribe((result: GameDialogResultInterface) => {
      if (result && result.save) {
        if (!result.formValue.storyTimerMinutes) {
          result.formValue.storyTimerMinutes = this.domainService.getDomain().defaultGameSettings.values.storyTimerMinutes;
        }

        this.confirmEvent.emit(result);
      }
    });
  }
}
