import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-card-component',
  templateUrl: 'game-card.component.html',
  styleUrls: ['game-card.component.scss']
})
export class GameCardComponent {
  @Input() color: 'accent' | 'white' | 'grey';
  @Input() displayValue: string;
  @Input() interactive: boolean;
  @Input() isCardFront: boolean;
  @Input() marginRight: boolean;
  @Input() shouldDisplayCornerValue: boolean;
}
