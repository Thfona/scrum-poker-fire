import { CardSetInterface } from './card-set.interface';
import { GameCardInterface } from './game-card.interface';
import { GameSettingsInterface } from './game-settings.interface';

export interface DomainItemInterface {
  id: string;
  values: CardSetInterface[] | GameSettingsInterface | GameCardInterface[];
}
