import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-card-component',
  templateUrl: 'game-card.component.html',
  styleUrls: ['game-card.component.scss']
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
    const classes: string[] = [];

    if (this.color) {
      classes.push(this.color);
    }

    if (this.interactive) {
      classes.push('interactive');
    }

    if (this.marginRight) {
      classes.push('margin-right');
    }

    if (this.isSmall) {
      classes.push('small');
    }

    return classes;
  }
}
