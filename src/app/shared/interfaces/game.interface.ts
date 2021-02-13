import { FormGameInterface } from './form-game.interface';
import { GameSessionInterface } from './game-session.interface';
import { PlayerInterface } from './player.interface';
import { StoryInterface } from './story.interface';

export interface GameInterface extends FormGameInterface {
  id: string;
  ownerId: string;
  creationDate: string;
  stories: StoryInterface[];
  session: GameSessionInterface;
  bannedPlayers: PlayerInterface[];
}
