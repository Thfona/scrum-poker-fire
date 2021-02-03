import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';

import { HomePage } from './home/home.page';

const MODULES = [RouterModule, SharedModule];

const PAGES = [HomePage];

@NgModule({
  declarations: [...PAGES],
  imports: [...MODULES]
})
export class PagesModule {}
