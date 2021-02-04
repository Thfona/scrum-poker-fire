import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.layout.html',
  styleUrls: ['./main.layout.scss']
})
export class MainLayout {
  constructor(public authService: AuthService, private router: Router) {}

  public navigateTo(route: string) {
    return this.router.navigate([`/${route}`]);
  }
}
