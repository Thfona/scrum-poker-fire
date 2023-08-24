import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

const MODULES = [HomeRoutingModule, SharedModule];

const PAGES = [HomePage];

@NgModule({
  declarations: [...PAGES],
  imports: [...MODULES],
})
export class HomeModule {}
