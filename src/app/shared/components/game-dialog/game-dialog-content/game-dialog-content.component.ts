import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { TranslocoService } from '@ngneat/transloco';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { CardSetInterface } from 'src/app/shared/interfaces/card-set.interface';
import { GameCardInterface } from 'src/app/shared/interfaces/game-card.interface';
import { GameDialogDataInterface } from 'src/app/shared/interfaces/game-dialog-data.interface';
import { GameDialogResultInterface } from 'src/app/shared/interfaces/game-dialog-result.interface';
import { CardSetOption } from 'src/app/shared/types/card-set-option.type';
import { DOMAIN } from 'src/app/shared/constants/domain.constant';

@Component({
  selector: 'app-game-dialog-content-component',
  templateUrl: './game-dialog-content.component.html',
  styleUrls: ['./game-dialog-content.component.scss'],
})
export class GameDialogContentComponent implements OnInit, AfterViewInit {
  @ViewChild('gameName') gameName: ElementRef;
  private voteSkipOptions: GameCardInterface[];
  public cardSets: CardSetInterface[];
  public formGroup: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string>;
    teamVelocity: FormControl<number>;
    shareVelocity: FormControl<boolean>;
    isPrivate: FormControl<boolean>;
    cardSet: FormControl<CardSetOption>;
    autoFlip: FormControl<boolean>;
    allowVoteChangeAfterReveal: FormControl;
    calculateScore: FormControl<boolean>;
    storyTimer: FormControl<boolean>;
    storyTimerMinutes: FormControl<number>;
  }>;
  public saveAsDefaultSettings = false;

  public get cancelResult(): GameDialogResultInterface {
    return {
      save: false,
      start: false,
      formValue: null,
      saveAsDefaultSettings: false,
    };
  }

  public get saveResult(): GameDialogResultInterface {
    return {
      save: true,
      start: false,
      formValue: this.formGroup.value,
      saveAsDefaultSettings: this.saveAsDefaultSettings,
    };
  }

  public get saveAndStartResult(): GameDialogResultInterface {
    return {
      ...this.saveResult,
      start: true,
    };
  }

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly dialogService: DialogService,
    private readonly translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) public readonly data: GameDialogDataInterface,
  ) {}

  ngOnInit() {
    this.voteSkipOptions = DOMAIN.voteSkipOptions;
    this.cardSets = DOMAIN.cardSetOptions;

    this.formGroup = new FormGroup({
      name: new FormControl(this.data.formData.name, Validators.required),
      description: new FormControl(this.data.formData.description),
      teamVelocity: new FormControl(this.data.formData.teamVelocity, Validators.required),
      shareVelocity: new FormControl(this.data.formData.shareVelocity, Validators.required),
      isPrivate: new FormControl(DOMAIN.defaultGameSettings.isPrivate, Validators.required), // TODO(backlog): Enable once private rooms are implemented
      cardSet: new FormControl(this.data.formData.cardSet, Validators.required),
      autoFlip: new FormControl(this.data.formData.autoFlip, Validators.required),
      allowVoteChangeAfterReveal: new FormControl(this.data.formData.allowVoteChangeAfterReveal, Validators.required),
      calculateScore: new FormControl(this.data.formData.calculateScore, Validators.required),
      storyTimer: new FormControl(DOMAIN.defaultGameSettings.storyTimer, Validators.required), // TODO(backlog): Enable once story timers are implemented
      storyTimerMinutes: new FormControl(DOMAIN.defaultGameSettings.storyTimerMinutes), // TODO(backlog): Enable once story timers are implemented
    });
  }

  ngAfterViewInit() {
    this.gameName.nativeElement.focus();
    this.changeDetector.detectChanges();
  }

  @HostListener('window:keyup.enter')
  onEnter() {
    if (this.formGroup.valid) {
      this.dialogService.currentDialogReference.close(this.saveResult);
    }
  }

  public setSaveAsDefaultSettings() {
    this.saveAsDefaultSettings = !this.saveAsDefaultSettings;
  }

  public getCardSetDisplayValues(cards: GameCardInterface[]) {
    let cardDisplayValues = '(';

    cards.map((card) => {
      cardDisplayValues = cardDisplayValues.concat(this.translocoService.translate(card.displayValue).concat(', '));
    });

    this.voteSkipOptions.map((item) => {
      cardDisplayValues = cardDisplayValues.concat(this.translocoService.translate(item.displayValue).concat(', '));
    });

    cardDisplayValues = cardDisplayValues.slice(0, -2).concat(')');

    return cardDisplayValues;
  }
}
