import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefugePage } from './refuge.page';

const routes: Routes = [
  {
    path: ':id',
    component: RefugePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefugePageRoutingModule {}
