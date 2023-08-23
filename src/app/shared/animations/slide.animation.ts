import { trigger, state, style, transition, animate } from '@angular/animations';

export const SLIDE_ANIMATION = [
  trigger('slide', [
    state(
      'in',
      style({
        transform: 'translate3d(0, 0, 0)',
      }),
    ),
    state(
      'out',
      style({
        transform: 'translate3d(100%, 0, 0)',
      }),
    ),
    state(
      'on',
      style({
        transform: 'translate3d(0, 0, 0)',
      }),
    ),
    state(
      'off',
      style({
        transform: 'translate3d(100%, 0, 0)',
      }),
    ),
    transition('* => in', animate('300ms ease-in-out')),
    transition('* => out', animate('300ms ease-in-out')),
    transition('* => on', animate('0ms')),
    transition('* => off', animate('0ms')),
  ]),
];
