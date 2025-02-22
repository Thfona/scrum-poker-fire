import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogDataInterface } from '../../interfaces/dialog-data.interface';
import { DialogContentComponent } from './dialog-content/dialog-content.component';

@Component({
    selector: 'app-dialog-component',
    template: '',
    standalone: false,
})
export class DialogComponent implements OnDestroy {
    @Input() data: DialogDataInterface;
    @Output() confirmEvent = new EventEmitter();
    private dialogSubscription: Subscription;

    constructor(private readonly matDialog: MatDialog) {}

    ngOnDestroy() {
        if (this.dialogSubscription) {
            this.dialogSubscription.unsubscribe();
        }
    }

    public openDialog() {
        const dialogReference = this.matDialog.open(DialogContentComponent, {
            data: this.data,
            autoFocus: false,
        });

        this.dialogSubscription = dialogReference.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.confirmEvent.emit();
            }
        });
    }
}
