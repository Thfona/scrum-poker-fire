import { GameCardInterface } from './game-card.interface';

export interface GameVoteInterface extends GameCardInterface {
  userId: string;
  storyId: string;
}
