import { GameSettingsInterface } from './game-settings.interface';
import { UserAuthDataInterface } from './user-auth-data.interface';

export interface UserInterface extends UserAuthDataInterface {
  defaultGameSettings?: GameSettingsInterface;
}
