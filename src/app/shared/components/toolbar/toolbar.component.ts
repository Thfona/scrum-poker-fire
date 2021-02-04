import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar-component',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  public navigateTo(route: string) {
    return this.router.navigate([`/${route}`]);
  }
}
