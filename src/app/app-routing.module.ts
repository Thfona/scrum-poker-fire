import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { loginGuard } from './shared/guards/login.guard';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
        canLoad: [loginGuard],
        canActivate: [loginGuard],
    },
    {
        path: 'poker',
        loadChildren: () => import('./pages/poker/poker.module').then((m) => m.PokerModule),
        canLoad: [loginGuard],
        canActivate: [loginGuard],
    },
    {
        path: 'retro',
        loadChildren: () => import('./pages/retro/retro.module').then((m) => m.RetroModule),
        canLoad: [loginGuard],
        canActivate: [loginGuard],
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule),
        canLoad: [authGuard],
        canActivate: [authGuard],
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
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
