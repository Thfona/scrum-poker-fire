import { CardSetOptionsInterface } from './card-set-options.interface';
import { DefaultGameSettingsInterface } from './default-game-settings.interface';
import { VoteSkipOptionsInterface } from './vote-skip-options.interface';

export interface DomainInterface {
  cardSetOptions: CardSetOptionsInterface;
  defaultGameSettings: DefaultGameSettingsInterface;
  voteSkipOptions: VoteSkipOptionsInterface;
}
