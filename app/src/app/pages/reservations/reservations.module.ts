import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationsPageRoutingModule } from './reservations-routing.module';

import { ReservationsPage } from './reservations.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveReservationsComponent } from '../../components/reactive-reservations/reactive-reservations.component';
import { ReservationsItemComponent } from '../../components/reservations-item/reservations-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationsPageRoutingModule,
    TranslateModule,
  ],
  declarations: [
    ReservationsPage,
    ReactiveReservationsComponent,
    ReservationsItemComponent,
  ],
})
export class ReservationsPageModule {}
