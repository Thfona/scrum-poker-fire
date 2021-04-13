import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoryDialogDataInterface } from 'src/app/shared/interfaces/story-dialog-data.interface';

@Component({
  selector: 'app-story-dialog-content-component',
  templateUrl: './story-dialog-content.component.html',
  styleUrls: ['./story-dialog-content.component.scss']
})
export class StoryDialogContentComponent implements OnInit, AfterViewInit {
  @ViewChild('storyName') storyName: ElementRef;
  @ViewChild('storyScore') storyScore: ElementRef;
  public formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StoryDialogDataInterface,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.data.formData.name, Validators.required),
      score: new FormControl(this.data.formData.score)
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
}
