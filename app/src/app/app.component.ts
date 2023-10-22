import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { map, Observable } from 'rxjs';
import { get } from 'scriptjs';
import { secretEnvironment } from '../environments/environment.secret';

export interface Page {
  title: string;
  url: string;
  icon: string;
}

const topPages: Page[] = [
  { title: 'Home', url: '/home', icon: 'home' },
  { title: 'Reservations', url: '/reservations', icon: 'folder' },
];

const bottomPages: Page[] = [
  { title: 'Account', url: '/user', icon: 'person' },
  { title: 'Logout', url: '/logout', icon: 'log-out' },
  { title: 'Login', url: '/login', icon: 'log-in' },
];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  googleMapsLoaded = false;

  bottomPages: Observable<Page[]> = this.authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) return bottomPages.slice(0, 2);
      else return bottomPages.slice(2, 3);
    }),
  );

  topPages: Observable<Page[]> = this.authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) return topPages;
      else return topPages.slice(0, 1);
    }),
  );

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    get(
      `https://maps.googleapis.com/maps/api/js?key=${secretEnvironment.mapsKey}&libraries=places&language=ca`,
      () => {
        this.googleMapsLoaded = true;
      },
    );
  }
}
