import { CardInterface } from '../interfaces/card.interface';
import { DEFAULT_CARDS } from './default-cards.constant';

export const MODIFIED_FIBONACCI_CARD_SET: CardInterface[] = [
  ...DEFAULT_CARDS,
  {
    index: 0,
    value: 0
  },
  {
    index: 1,
    value: 0.5
  },
  {
    index: 2,
    value: 1
  },
  {
    index: 3,
    value: 2
  },
  {
    index: 4,
    value: 3
  },
  {
    index: 5,
    value: 5
  },
  {
    index: 6,
    value: 8
  },
  {
    index: 7,
    value: 13
  },
  {
    index: 8,
    value: 20
  },
  {
    index: 9,
    value: 40
  },
  {
    index: 10,
    value: 100
  }
];
