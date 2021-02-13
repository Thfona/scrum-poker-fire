import { CardSet } from '../types/card-set.type';

export interface GameSettingsInterface {
  teamVelocity: number;
  shareVelocity: boolean;
  cardSet: CardSet;
  autoFlip: boolean;
  allowVoteChangeAfterReveal: boolean;
  calculateScore: boolean;
  storyTimer: boolean;
  storyTimerMinutes: number;
}
