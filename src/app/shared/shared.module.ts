import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MainLayout } from './layouts/main/main.layout';
import { EmptyLayout } from './layouts/empty/empty.layout';

const COMPONENTS = [];

const LAYOUTS = [MainLayout, EmptyLayout];

const MODULES = [BrowserAnimationsModule, CommonModule, RouterModule];

const SERVICES = [];

@NgModule({
  declarations: [...COMPONENTS, ...LAYOUTS],
  imports: [...MODULES],
  exports: [...COMPONENTS, ...MODULES],
  providers: [...SERVICES]
})
export class SharedModule {}
