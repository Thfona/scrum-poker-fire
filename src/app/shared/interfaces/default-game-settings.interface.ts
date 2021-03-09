import { DomainItemInterface } from './domain-item.interface';
import { GameSettingsInterface } from './game-settings.interface';

export interface DefaultGameSettingsInterface extends DomainItemInterface {
  values: GameSettingsInterface;
}
