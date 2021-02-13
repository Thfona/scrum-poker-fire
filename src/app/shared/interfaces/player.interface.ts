import { GameSessionUserInterface } from './game-session-user.interface';

export interface PlayerInterface extends GameSessionUserInterface {
  vote: number;
  skippedVote: boolean;
  voteSkipValue: string;
}
