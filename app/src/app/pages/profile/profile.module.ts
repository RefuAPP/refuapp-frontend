import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile-get/profile.page';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileUpdatePage } from './profile-update/profile-update/profile-update.page';
import { LanguageSettingsComponent } from '../../components/language-settings/language-settings.component';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    TranslateModule,
    MaskitoModule,
  ],
  declarations: [ProfilePage, ProfileUpdatePage, LanguageSettingsComponent],
})
export class ProfilePageModule {}
