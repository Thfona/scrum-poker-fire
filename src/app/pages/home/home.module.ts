import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

const modules = [HomeRoutingModule, SharedModule];

const pages = [HomePage];

@NgModule({
  declarations: [...pages],
  imports: [...modules],
})
export class HomeModule {}
