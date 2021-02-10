import { FormStoryInterface } from './form-story.interface';

export interface FormGameInterface {
  name: string;
  description: string;
  stories: FormStoryInterface[];
}
