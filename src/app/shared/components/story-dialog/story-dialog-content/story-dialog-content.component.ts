import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoryDialogDataInterface } from 'src/app/shared/interfaces/story-dialog-data.interface';

@Component({
  selector: 'app-story-dialog-content-component',
  templateUrl: './story-dialog-content.component.html',
  styleUrls: ['./story-dialog-content.component.scss']
})
export class StoryDialogContentComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: StoryDialogDataInterface) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.data.formData.name, Validators.required),
      score: new FormControl(this.data.formData.score)
    });
  }
}
