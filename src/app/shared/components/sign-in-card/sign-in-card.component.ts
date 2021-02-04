import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-in-card-component',
  templateUrl: './sign-in-card.component.html',
  styleUrls: ['./sign-in-card.component.scss']
})
export class SignInCardComponent {
  constructor(public authService: AuthService) {}
}
