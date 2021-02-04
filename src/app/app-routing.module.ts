import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { LoginGuard } from './shared/guards/login.guard';

import { MainLayout } from './shared/layouts/main/main.layout';
import { EmptyLayout } from './shared/layouts/empty/empty.layout';

import { AuthPage } from './pages/auth/auth.page';
import { GamesPage } from './pages/games/games.page';
import { HomePage } from './pages/home/home.page';

const ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'games',
        component: GamesPage
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    component: EmptyLayout,
    children: [
      {
        path: 'auth',
        component: AuthPage,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
