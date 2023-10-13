import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import {RefugeComponent} from "../refuge/refuge.component";

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'refuge/:id',
    component: RefugeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
