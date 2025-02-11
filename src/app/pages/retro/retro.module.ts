import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RetroRoutingModule } from './retro-routing.module';
import { RetroPage } from './retro.page';
import { ReflectPage } from './reflect/reflect.page';

const MODULES = [RetroRoutingModule, SharedModule];

const PAGES = [ReflectPage, RetroPage];

@NgModule({
    declarations: [...PAGES],
    imports: [...MODULES],
})
export class RetroModule {}
