import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VIEWPORTS } from '../constants/viewports.constant';
import { WINDOW } from './window.service';

@Injectable()
export class ViewportService {
  private isDesktopSubject: BehaviorSubject<boolean>;
  private isLargeScreenSubject: BehaviorSubject<boolean>;
  public isDesktopObservable: Observable<boolean>;
  public isLargeScreenObservable: Observable<boolean>;

  constructor(@Inject(WINDOW) private window: Window) {
    this.isDesktopSubject = new BehaviorSubject(this.setIsDesktop());
    this.isLargeScreenSubject = new BehaviorSubject(this.setIsLargeScreen());

    this.isDesktopObservable = this.isDesktopSubject.asObservable();
    this.isLargeScreenObservable = this.isLargeScreenSubject.asObservable();

    this.window.addEventListener('resize', this.onResize.bind(this));
  }

  private setIsDesktop() {
    return this.window.innerWidth >= VIEWPORTS.mediumLarge;
  }

  private setIsLargeScreen() {
    return this.window.innerWidth >= VIEWPORTS.large;
  }

  private onResize() {
    this.isDesktopSubject.next(this.setIsDesktop());

    this.isLargeScreenSubject.next(this.setIsLargeScreen());
  }
}
