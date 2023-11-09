import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserCreated } from 'src/app/schemas/user/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { changeLanguageRequest } from '../../state/language/language.actions';
import {
  getCurrentLanguage,
  selectLanguage,
} from '../../state/language/language.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user?: UserCreated;
  avatarNumber: number = 1;

  currentLanguage$ = this.store.select(getCurrentLanguage);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private store: Store<AppState>,
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
    this.store.dispatch(changeLanguageRequest({ languageCode }));
  }
}
