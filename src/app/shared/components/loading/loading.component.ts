import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-component',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input() center = true;
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  private diameterMap = {
    small: 40,
    medium: 70,
    large: 100,
  };
  public diameter: number;

  ngOnInit() {
    this.diameter = this.diameterMap[this.size];
  }
}
