import { CardSetInterface } from './card-set.interface';
import { DomainItemInterface } from './domain-item.interface';

export interface CardSetOptionsInterface extends DomainItemInterface {
  values: CardSetInterface[];
}
