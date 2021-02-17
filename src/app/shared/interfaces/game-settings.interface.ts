import { CardSetOption } from '../types/card-set-option.type';

export interface GameSettingsInterface {
  teamVelocity: number;
  shareVelocity: boolean;
  cardSet: CardSetOption;
  autoFlip: boolean;
  allowVoteChangeAfterReveal: boolean;
  calculateScore: boolean;
  storyTimer: boolean;
  storyTimerMinutes: number;
}
