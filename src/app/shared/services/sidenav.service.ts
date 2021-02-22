import { Injectable } from '@angular/core';

@Injectable()
export class SidenavService {
  private hiddenSidenavStates = ['out', 'off'];
  public isSidenavOpen: boolean;
  public sidenavState: 'in' | 'out' | 'on' | 'off';

  public toggleSidenav() {
    this.sidenavState = this.hiddenSidenavStates.includes(this.sidenavState) ? 'in' : 'out';
    this.isSidenavOpen = this.hiddenSidenavStates.includes(this.sidenavState) ? false : true;
  }
}
