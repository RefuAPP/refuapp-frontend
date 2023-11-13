import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefugePageRoutingModule } from './refuge-routing.module';

import { RefugePage } from './refuge.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReservationPickerComponent } from '../../components/reservation-picker/reservation-picker.component';
import { ReservationsChartComponent } from '../../components/reservations-chart/reservations-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefugePageRoutingModule,
    TranslateModule,
  ],
  declarations: [
    RefugePage,
    ReservationPickerComponent,
    ReservationsChartComponent,
  ],
  exports: [RefugePage],
})
export class RefugePageModule {}
