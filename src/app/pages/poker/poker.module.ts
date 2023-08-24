import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PokerRoutingModule } from './poker-routing.module';
import { PokerPage } from './poker.page';
import { PlayPage } from './play/play.page';

const MODULES = [PokerRoutingModule, SharedModule];

const PAGES = [PokerPage, PlayPage];

@NgModule({
  declarations: [...PAGES],
  imports: [...MODULES],
})
export class PokerModule {}
