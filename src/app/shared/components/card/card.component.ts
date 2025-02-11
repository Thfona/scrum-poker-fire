import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-card-component',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() isLoading: boolean;
  @Input() hasError: boolean;
  @Input() cardTitleKey: string;
  @Input() shouldDisplayHeaderButton: boolean;
  @Input() headerButtonIconKey: string;
  @Input() headerButtonTextKey: string;
  @Input() errorMessageKey: string;
  @Output() headerButtonEvent = new EventEmitter();

  public handleHeaderButtonClick() {
      this.headerButtonEvent.emit();
  }
}
