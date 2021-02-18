import { GameSessionUserInterface } from './game-session-user.interface';
import { PlayerVoteInferface } from './player-vote.interface';

export interface PlayerInterface extends GameSessionUserInterface {
  vote: PlayerVoteInferface;
}
