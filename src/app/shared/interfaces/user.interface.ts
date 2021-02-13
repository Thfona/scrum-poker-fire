import { GameSettingsInterface } from './game-settings.interface';

export interface UserInterface {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  defaultGameSettings?: GameSettingsInterface;
}
