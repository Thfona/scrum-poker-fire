import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetroPage } from './retro.page';
import { ReflectPage } from './reflect/reflect.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RetroPage,
        pathMatch: 'full',
      },
      {
        path: ':retroId',
        component: ReflectPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetroRoutingModule {}
