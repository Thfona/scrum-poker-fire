import { DomainItemInterface } from './domain-item.interface';
import { GameCardInterface } from './game-card.interface';

export interface VoteSkipOptionsInterface extends DomainItemInterface {
  values: GameCardInterface[];
}
