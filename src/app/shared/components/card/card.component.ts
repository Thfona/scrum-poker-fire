import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-component',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() isLoading: boolean;
  @Input() hasError: boolean;
  @Input() cardTitleCode: string;
  @Input() errorMessageCode: string;
}
