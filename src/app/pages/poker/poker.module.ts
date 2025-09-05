import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PokerRoutingModule } from './poker-routing.module';
import { PokerPage } from './poker.page';
import { PlayPage } from './play/play.page';

const modules = [PokerRoutingModule, SharedModule];

const pages = [PokerPage, PlayPage];

@NgModule({
  declarations: [...pages],
  imports: [...modules],
})
export class PokerModule {}
