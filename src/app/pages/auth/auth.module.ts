import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';

const modules = [AuthRoutingModule, SharedModule];

const pages = [AuthPage];

@NgModule({
  declarations: [...pages],
  imports: [...modules],
})
export class AuthModule {}
