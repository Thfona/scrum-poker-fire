import { StoryInterface } from './story.interface';

export interface GameInterface {
  ownerId: string;
  name: string;
  description: string;
  creationDate: string;
  stories: StoryInterface[];
  sessionActive: boolean;
}
