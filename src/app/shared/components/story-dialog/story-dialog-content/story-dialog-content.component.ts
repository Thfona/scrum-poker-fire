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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoryDialogDataInterface } from 'src/app/shared/interfaces/story-dialog-data.interface';
import { StoryDialogResultInterface } from 'src/app/shared/interfaces/story-dialog-result.interface';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
    selector: 'app-story-dialog-content-component',
    templateUrl: './story-dialog-content.component.html',
    styleUrls: ['./story-dialog-content.component.scss'],
    standalone: false,
})
export class StoryDialogContentComponent implements OnInit, AfterViewInit {
  @ViewChild('storyName') storyName: ElementRef;
  @ViewChild('storyScore') storyScore: ElementRef;
  public formGroup: FormGroup<{
    name: FormControl<string>;
    score: FormControl<number>;
  }>;
  public cancelResult: StoryDialogResultInterface = {
      save: false,
      formValue: null,
      delete: false,
      goTo: false,
  };
  public deleteResult: StoryDialogResultInterface = {
      save: true,
      formValue: null,
      delete: true,
      goTo: false,
  };
  public goToResult: StoryDialogResultInterface = {
      save: false,
      formValue: null,
      delete: false,
      goTo: true,
  };

  public get saveResult(): StoryDialogResultInterface {
      return {
          save: true,
          formValue: this.formGroup.value,
          delete: false,
          goTo: false,
      };
  }

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public readonly data: StoryDialogDataInterface,
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
