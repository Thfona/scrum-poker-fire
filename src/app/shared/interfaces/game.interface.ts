import { GameSessionInterface } from './game-session.interface';
import { StoryInterface } from './story.interface';

export interface GameInterface {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  creationDate: string;
  stories: StoryInterface[];
  session: GameSessionInterface;
}
