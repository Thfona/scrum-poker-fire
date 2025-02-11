import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-error-component',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    standalone: false
})
export class ErrorComponent {
  @Input() center = true;
  @Input() message = 'ERROR_MESSAGE';
}
