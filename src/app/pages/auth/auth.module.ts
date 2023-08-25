import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';

const MODULES = [AuthRoutingModule, SharedModule];

const PAGES = [AuthPage];

@NgModule({
  declarations: [...PAGES],
  imports: [...MODULES],
})
export class AuthModule {}
