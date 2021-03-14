import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-component',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() isLoading: boolean;
  @Input() hasError: boolean;
  @Input() cardTitleCode: string;
  @Input() shouldDisplayHeaderButton: boolean;
  @Input() headerButtonIconCode: string;
  @Input() headerButtonTextCode: string;
  @Input() errorMessageCode: string;
  @Output() headerButtonEvent = new EventEmitter();

  public handleHeaderButtonClick() {
    this.headerButtonEvent.emit();
  }
}
