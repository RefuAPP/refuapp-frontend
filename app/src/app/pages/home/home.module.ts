import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { RefugePageModule } from '../refuge/refuge.module';
import { SearchbarLocationComponent } from '../../components/searchbar-location/searchbar-location.component';
import { RefugeModalComponent } from '../../components/refuge-modal/refuge-modal.component';
import { MapComponent } from '../../components/map/map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule,
    RefugePageModule,
  ],
  declarations: [
    HomePage,
    SearchbarLocationComponent,
    RefugeModalComponent,
    MapComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RefugeModalComponent],
})
export class HomePageModule {}
