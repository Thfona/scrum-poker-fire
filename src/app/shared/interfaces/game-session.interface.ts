import { GameSessionUserInterface } from './game-session-user.interface';

export interface GameSessionInterface {
  isActive: boolean;
  hasStarted: boolean;
  currentStoryIndex: number;
  users: GameSessionUserInterface[];
}
