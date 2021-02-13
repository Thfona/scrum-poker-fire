import { CardInterface } from '../interfaces/card.interface';
import { DEFAULT_CARDS } from './default-cards.constant';

export const FIBONACCI_CARD_SET: CardInterface[] = [
  ...DEFAULT_CARDS,
  {
    index: 0,
    value: 0
  },
  {
    index: 1,
    value: 1
  },
  {
    index: 2,
    value: 2
  },
  {
    index: 3,
    value: 3
  },
  {
    index: 4,
    value: 5
  },
  {
    index: 5,
    value: 8
  },
  {
    index: 6,
    value: 13
  },
  {
    index: 7,
    value: 21
  },
  {
    index: 8,
    value: 34
  },
  {
    index: 9,
    value: 55
  },
  {
    index: 10,
    value: 89
  }
];
