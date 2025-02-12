import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RetroRoutingModule } from './retro-routing.module';
import { RetroPage } from './retro.page';
import { ReflectPage } from './reflect/reflect.page';

const modules = [RetroRoutingModule, SharedModule];

const pages = [ReflectPage, RetroPage];

@NgModule({
    declarations: [...pages],
    imports: [...modules],
})
export class RetroModule {}
