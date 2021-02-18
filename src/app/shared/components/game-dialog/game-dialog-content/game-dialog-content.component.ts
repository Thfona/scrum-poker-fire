import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { CardInterface } from 'src/app/shared/interfaces/card.interface';
import { CardSetInterface } from 'src/app/shared/interfaces/card-set.interface';
import { GameDialogDataInterface } from 'src/app/shared/interfaces/game-dialog-data.interface';
import { DomainService } from 'src/app/shared/services/domain.service';

@Component({
  selector: 'app-game-dialog-content-component',
  templateUrl: './game-dialog-content.component.html',
  styleUrls: ['./game-dialog-content.component.scss']
})
export class GameDialogContentComponent implements OnInit {
  private voteSkipOptions: string[];
  public cardSets: CardSetInterface[];
  public formGroup: FormGroup;
  public saveAsDefaultSettings = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GameDialogDataInterface,
    private domainService: DomainService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    const DOMAIN = this.domainService.getDomain();
    this.voteSkipOptions = DOMAIN.voteSkipOptions.values;
    this.cardSets = DOMAIN.cardSetOptions.values;

    this.formGroup = new FormGroup({
      name: new FormControl(this.data.formData.name, Validators.required),
      description: new FormControl(this.data.formData.description),
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

  public getCardSetDisplayValues(cards: CardInterface[]) {
    let cardDisplayValues = '(';

    cards.map((card) => {
      cardDisplayValues = cardDisplayValues.concat(this.translocoService.translate(card.displayValue).concat(', '));
    });

    this.voteSkipOptions.map((item) => {
      cardDisplayValues = cardDisplayValues.concat(this.translocoService.translate(item).concat(', '));
    });

    cardDisplayValues = cardDisplayValues.slice(0, -2).concat(')');

    return cardDisplayValues;
  }
}
