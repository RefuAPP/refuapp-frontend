import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserCreated } from 'src/app/schemas/user/user';
import { DeviceLanguageService } from 'src/app/services/translate/device-language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user?: UserCreated;
  avatarNumber: number = 1;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private deviceLanguageService: DeviceLanguageService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.setRandomAvatar();
    this.authService.getUserId().then((userId: string | null) => {
      if (userId === null) {
        throw new Error('Not logged in, impossible to get user data');
      }
      this.http
        .get<UserCreated>(`${environment.API}/users/${userId}`)
        .subscribe({
          next: (userData: UserCreated) => {
            this.user = userData;
          },
          error: (error: any) => {
            console.error('Error fetching user info from API', error);
          },
        });
    });
  }

  setRandomAvatar() {
    this.avatarNumber = Math.floor(Math.random() * 8) + 1;
  }
  async changeLanguage(event: any) {
    const languageCode = (event as CustomEvent).detail.value;
    try {
      console.log(
        'Language code supported are: ',
        this.deviceLanguageService.getLanguagesCodes(),
      );
      await this.deviceLanguageService.setLanguageCode(languageCode);
      this.translateService.use(languageCode);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }
}
