import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutPage } from './logout.page';
import { userGuard } from '../../guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: LogoutPage,
    canActivate: [userGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogoutPageRoutingModule {}
