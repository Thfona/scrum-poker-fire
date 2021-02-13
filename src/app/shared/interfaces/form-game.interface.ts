import { GameSettingsInterface } from './game-settings.interface';

export interface FormGameInterface extends GameSettingsInterface {
  name: string;
  description: string;
}
