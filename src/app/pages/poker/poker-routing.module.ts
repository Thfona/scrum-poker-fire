import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokerPage } from './poker.page';
import { PlayPage } from './play/play.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PokerPage,
        pathMatch: 'full',
      },
      {
        path: ':gameId',
        component: PlayPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PokerRoutingModule {}
