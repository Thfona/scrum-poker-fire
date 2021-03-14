import { GameSessionUserInterface } from './game-session-user.interface';
import { GameVoteInterface } from './game-vote.interface';

export interface PlayerWithVoteInterface extends GameSessionUserInterface {
  vote: GameVoteInterface;
}
