import { PlayerVoteInferface } from './player-vote.interface';

export interface GameSessionUserInterface {
  id: string;
  name: string;
  isPlayer: boolean;
  vote: PlayerVoteInferface;
}
