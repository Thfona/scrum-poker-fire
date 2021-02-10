import { ThemeColor } from '../types/theme-color.type';

export interface DialogDataInterface {
  title: string;
  confirmButtonText: string;
  confirmButtonColor: ThemeColor;
  content?: string;
  cancelButtonText?: string;
}
