import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthPage } from './auth.page';

const MODULES = [SharedModule];

const PAGES = [AuthPage];

@NgModule({
  declarations: [...PAGES],
  imports: [...MODULES],
})
export class AuthModule {}
