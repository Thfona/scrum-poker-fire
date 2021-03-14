import { FormStoryInterface } from './form-story.interface';

export interface StoryInterface extends FormStoryInterface {
  id: string;
  index: number;
  hasFlippedCards: boolean;
}
