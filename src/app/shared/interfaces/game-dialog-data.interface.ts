import { FormGameInterface } from './form-game.interface';

export interface GameDialogDataInterface {
  title: string;
  formData: FormGameInterface;
  shouldDisplaySaveAndStart: boolean;
}
