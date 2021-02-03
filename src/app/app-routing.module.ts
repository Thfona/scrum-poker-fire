import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLayout } from './shared/layouts/main/main.layout';

import { HomePage } from './pages/home/home.page';

const ROUTES: Routes = [
  {
    path: 'home',
    component: MainLayout,
    children: [
      {
        path: '',
        component: HomePage
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
