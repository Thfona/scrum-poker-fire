import { Component, Input } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { SLIDE_ANIMATION } from 'src/app/shared/animations/slide.animation';

@Component({
    selector: 'app-sidenav-component',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    animations: [SLIDE_ANIMATION],
    standalone: false,
})
export class SidenavComponent {
  @Input() shouldDisplayOverlay: boolean;
  @Input() shouldDisplayMenuButton: boolean;

  constructor(public readonly sidenavService: SidenavService) {}

  public toggle() {
      this.sidenavService.toggleSidenav();
  }
}
