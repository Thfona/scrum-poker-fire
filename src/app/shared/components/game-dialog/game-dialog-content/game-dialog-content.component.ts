import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardSetInterface } from 'src/app/shared/interfaces/card-set.interface';
import { GameDialogDataInterface } from 'src/app/shared/interfaces/game-dialog-data.interface';
import { DomainService } from 'src/app/shared/services/domain.service';

@Component({
  selector: 'app-game-dialog-content-component',
  templateUrl: './game-dialog-content.component.html',
  styleUrls: ['./game-dialog-content.component.scss']
})
export class GameDialogContentComponent implements OnInit {
  public cardSets: CardSetInterface[];
  public formGroup: FormGroup;
  public saveAsDefaultSettings = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: GameDialogDataInterface, private domainService: DomainService) {}

  ngOnInit() {
    this.cardSets = this.domainService.getDomain().cardSetOptions.values;

    this.formGroup = new FormGroup({
      name: new FormControl(this.data.formData.name, Validators.required),
      description: new FormControl(this.data.formData.description, Validators.required),
      teamVelocity: new FormControl(this.data.formData.teamVelocity, Validators.required),
      shareVelocity: new FormControl(this.data.formData.shareVelocity, Validators.required),
      cardSet: new FormControl(this.data.formData.cardSet, Validators.required),
      autoFlip: new FormControl(this.data.formData.autoFlip, Validators.required),
      allowVoteChangeAfterReveal: new FormControl(this.data.formData.allowVoteChangeAfterReveal, Validators.required),
      calculateScore: new FormControl(this.data.formData.calculateScore, Validators.required),
      storyTimer: new FormControl(this.data.formData.storyTimer, Validators.required),
      storyTimerMinutes: new FormControl(this.data.formData.storyTimerMinutes)
    });
  }

  public setSaveAsDefaultSettings() {
    this.saveAsDefaultSettings = !this.saveAsDefaultSettings;
  }
}
