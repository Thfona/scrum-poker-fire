import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VIEWPORTS } from '../constants/viewports.constant';
import { WINDOW } from './window.service';

@Injectable()
export class ViewportService {
  public isDesktop: BehaviorSubject<boolean>;

  constructor(@Inject(WINDOW) private window: Window) {
    this.isDesktop = new BehaviorSubject(this.setIsDesktop());
    this.window.addEventListener('resize', this.onResize.bind(this));
  }

  private setIsDesktop() {
    return this.window.innerWidth >= VIEWPORTS.mediumLarge;
  }

  private onResize() {
    this.isDesktop.next(this.setIsDesktop());
  }
}
