import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { MainLayout } from './layouts/main/main.layout';
import { EmptyLayout } from './layouts/empty/empty.layout';

const COMPONENTS = [];

const LAYOUTS = [MainLayout, EmptyLayout];

const MODULES = [BrowserAnimationsModule, CommonModule, MatToolbarModule, MatIconModule, RouterModule];

const SERVICES = [];

@NgModule({
  declarations: [...COMPONENTS, ...LAYOUTS],
  imports: [...MODULES],
  exports: [...COMPONENTS, ...MODULES],
  providers: [...SERVICES]
})
export class SharedModule {}
