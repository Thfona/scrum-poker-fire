import { GameSessionUserInterface } from './game-session-user.interface';
import { PlayerInterface } from './player.interface';

export interface GameSessionInterface {
  isActive: boolean;
  hasStarted: boolean;
  currentStoryIndex: number;
  players: PlayerInterface[];
  spectators: GameSessionUserInterface[];
}
