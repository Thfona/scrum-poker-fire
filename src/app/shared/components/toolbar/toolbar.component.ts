import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserInterface } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar-component',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() user: UserInterface;

  constructor(public authService: AuthService, private router: Router) {}

  public navigateTo(route: string) {
    return this.router.navigate([`/${route}`]);
  }
}
