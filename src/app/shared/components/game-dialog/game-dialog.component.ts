import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GameDialogDataInterface } from '../../interfaces/game-dialog-data.interface';
import { GameDialogResultInterface } from '../../interfaces/game-dialog-result.interface';
import { DialogService } from '../../services/dialog.service';
import { GameDialogContentComponent } from './game-dialog-content/game-dialog-content.component';
import { DOMAIN } from '../../constants/domain.constant';

@Component({
  selector: 'app-game-dialog-component',
  template: '',
  standalone: false,
})
export class GameDialogComponent implements OnDestroy {
    @Input() data: GameDialogDataInterface;
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
      const dialogReference = this.matDialog.open(GameDialogContentComponent, {
        data: this.data,
        autoFocus: false,
      });

      this.dialogService.currentDialogReference = dialogReference;

      this.dialogSubscription = dialogReference.afterClosed().subscribe((result: GameDialogResultInterface) => {
        this.dialogService.currentDialogReference = undefined;

        if (result?.save) {
          if (!result.formValue.storyTimerMinutes) {
            result.formValue.storyTimerMinutes = DOMAIN.defaultGameSettings.storyTimerMinutes;
          }

          this.confirmEvent.emit(result);
        }
      });
    }
}
