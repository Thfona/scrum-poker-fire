import { FormStoryInterface } from './form-story.interface';

export interface StoryDialogDataInterface {
  title: string;
  formData: FormStoryInterface;
  isEditOperation: boolean;
  gameHasStarted: boolean;
}
