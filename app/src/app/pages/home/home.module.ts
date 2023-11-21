import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SearchbarLocationComponent } from '../../components/searchbar-location/searchbar-location.component';
import { RefugeModalComponent } from '../../components/refuge-modal/refuge-modal.component';
import { MapComponent } from '../../components/map/map.component';
import { RefugePage } from '../../components/refuge/refuge.page';
import { RefugeInfoComponent } from '../../components/refuge-info/refuge-info.component';
import { ReservationPickerComponent } from '../../components/reservation-picker/reservation-picker.component';
import { ReservationsPageModule } from '../reservations/reservations.module';
import { ReservationsChartComponent } from '../../components/reservations-chart/reservations-chart.component';
import { BarChartModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule,
    ReservationsPageModule,
    BarChartModule,
  ],
  declarations: [
    HomePage,
    SearchbarLocationComponent,
    RefugeModalComponent,
    MapComponent,
    RefugePage,
    RefugeInfoComponent,
    RefugeInfoComponent,
    ReservationPickerComponent,
    ReservationsChartComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RefugeModalComponent],
})
export class HomePageModule {}
