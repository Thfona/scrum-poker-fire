import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-game-card-component',
    templateUrl: 'game-card.component.html',
    styleUrls: ['game-card.component.scss'],
    standalone: false
})
export class GameCardComponent {
  @Input() color: 'primary' | 'accent' | 'white' | 'grey';
  @Input() displayValue: string;
  @Input() interactive: boolean;
  @Input() isCardFront: boolean;
  @Input() isSmall: boolean;
  @Input() marginRight: boolean;
  @Input() shouldDisplayCornerValue: boolean;

  public getClasses() {
      const CLASSES: string[] = [];

      if (this.color) {
          CLASSES.push(this.color);
      }

      if (this.interactive) {
          CLASSES.push('interactive');
      }

      if (this.marginRight) {
          CLASSES.push('margin-right');
      }

      if (this.isSmall) {
          CLASSES.push('small');
      }

      return CLASSES;
  }
}
