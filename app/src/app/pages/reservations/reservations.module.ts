import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationsPageRoutingModule } from './reservations-routing.module';

import { ReservationsPage } from './reservations.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReservationsItemComponent } from '../../components/reservations-item/reservations-item.component';
import { BannerAdComponent } from '../../components/banner-ad/banner-ad.component';

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
    ReservationsItemComponent,
    BannerAdComponent,
  ],
  exports: [ReservationsItemComponent],
})
export class ReservationsPageModule {}
