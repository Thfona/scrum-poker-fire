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
import { StoryDialogDataInterface } from 'src/app/shared/interfaces/story-dialog-data.interface';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-story-dialog-content-component',
  templateUrl: './story-dialog-content.component.html',
  styleUrls: ['./story-dialog-content.component.scss'],
})
export class StoryDialogContentComponent implements OnInit, AfterViewInit {
  @ViewChild('storyName') storyName: ElementRef;
  @ViewChild('storyScore') storyScore: ElementRef;
  public formGroup: FormGroup<{
    name: FormControl<string>;
    score: FormControl<number>;
  }>;

  get cancelResult() {
    return {
      save: false,
      formValue: null,
      delete: false,
    };
  }

  get deleteResult() {
    return {
      save: true,
      formValue: null,
      delete: true,
    };
  }

  get saveResult() {
    return {
      save: true,
      formValue: this.formGroup.value,
      delete: false,
    };
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StoryDialogDataInterface,
    private changeDetector: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.data.formData.name, Validators.required),
      score: new FormControl(this.data.formData.score),
    });
  }

  ngAfterViewInit() {
    if (this.storyScore) {
      this.storyScore.nativeElement.focus();
    } else {
      this.storyName.nativeElement.focus();
    }

    this.changeDetector.detectChanges();
  }

  @HostListener('window:keyup.enter')
  onEnter() {
    if (this.formGroup.valid) {
      this.dialogService.currentDialogReference.close(this.saveResult);
    }
  }
}
