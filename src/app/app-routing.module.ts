import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginGuard } from './shared/guards/login.guard';

const ROUTES: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
    canLoad: [LoginGuard],
    canActivate: [LoginGuard],
  },
  {
    path: 'poker',
    loadChildren: () => import('./pages/poker/poker.module').then((m) => m.PokerModule),
    canLoad: [LoginGuard],
    canActivate: [LoginGuard],
  },
  {
    path: 'retro',
    loadChildren: () => import('./pages/retro/retro.module').then((m) => m.RetroModule),
    canLoad: [LoginGuard],
    canActivate: [LoginGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
