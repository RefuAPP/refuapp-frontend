import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefugePageRoutingModule } from './refuge-routing.module';

import { RefugePage } from './refuge.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReservationPickerComponent } from '../../components/reservation-picker/reservation-picker.component';
import { ReservationsChartComponent } from '../../components/reservations-chart/reservations-chart.component';
import { ReservationsPageModule } from '../reservations/reservations.module';
import { ReservationsComponent } from '../../components/reservations/reservations.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefugePageRoutingModule,
    TranslateModule,
    ReservationsPageModule,
  ],
  declarations: [
    RefugePage,
    ReservationPickerComponent,
    ReservationsChartComponent,
    ReservationsComponent,
  ],
  exports: [RefugePage],
})
export class RefugePageModule {}
