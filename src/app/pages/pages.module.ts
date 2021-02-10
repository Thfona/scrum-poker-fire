import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthPage } from './auth/auth.page';
import { HomePage } from './home/home.page';
import { PlayGamePage } from './play-game/play-game.page';

const MODULES = [RouterModule, SharedModule];

const PAGES = [AuthPage, HomePage, PlayGamePage];

@NgModule({
  declarations: [...PAGES],
  imports: [...MODULES]
})
export class PagesModule {}
