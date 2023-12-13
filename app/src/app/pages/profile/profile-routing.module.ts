import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile-get/profile.page';
import { userGuard } from '../../guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    canActivate: [userGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
