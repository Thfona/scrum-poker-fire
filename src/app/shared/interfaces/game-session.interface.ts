import { GameSessionUserInterface } from './game-session-user.interface';
import { GameVoteInterface } from './game-vote.interface';

export interface GameSessionInterface {
  isActive: boolean;
  hasStarted: boolean;
  currentStoryId: string;
  users: GameSessionUserInterface[];
  votes: GameVoteInterface[];
}
