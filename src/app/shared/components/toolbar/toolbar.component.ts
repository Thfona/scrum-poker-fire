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
  public gitHubLogoSrc = 'assets/svg/github-circle-white-transparent.svg';
  public gitHubRepositoryLink = 'https://github.com/Thfona/scrum-poker-fire-frontend';

  constructor(public authService: AuthService, private router: Router) {}

  public navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  public openGitHubRepository() {
    window.open(this.gitHubRepositoryLink, '_blank');
  }
}
