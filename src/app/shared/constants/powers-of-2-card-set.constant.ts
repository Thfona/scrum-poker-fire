import { CardInterface } from '../interfaces/card.interface';
import { DEFAULT_CARDS } from './default-cards.constant';

export const POWERS_OF_2_CARD_SET: CardInterface[] = [
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
    value: 4
  },
  {
    index: 4,
    value: 8
  },
  {
    index: 5,
    value: 16
  },
  {
    index: 6,
    value: 32
  },
  {
    index: 7,
    value: 64
  }
];
