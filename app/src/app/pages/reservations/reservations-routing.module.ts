import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservationsPage } from './reservations.page';
import { userGuard } from '../../guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: ReservationsPage,
    canActivate: [userGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationsPageRoutingModule {}
