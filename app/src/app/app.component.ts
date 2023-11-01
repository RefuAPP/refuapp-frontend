import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { get } from 'scriptjs';
import { secretEnvironment } from '../environments/environment.secret';
import { DeviceLanguageService } from './services/translate/device-language.service';
import { TranslateService } from '@ngx-translate/core';

export interface Page {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  googleMapsLoaded = false;
  private topPages: Subject<Page[]> = new Subject<Page[]>();
  private bottomPages: Subject<Page[]> = new Subject<Page[]>();
  private topPagesComplete$: Observable<Page[]> = this.topPages.asObservable();
  private bottomPagesComplete$: Observable<Page[]> =
    this.bottomPages.asObservable();
  private isAuthenticated$: Observable<boolean>;

  bottomPages$: Observable<Page[]>;
  topPages$: Observable<Page[]>;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private deviceLanguageService: DeviceLanguageService,
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.bottomPages$ = combineLatest([
      this.bottomPagesComplete$,
      this.isAuthenticated$,
    ]).pipe(
      map((result) => {
        const pages = result[0];
        const isAuthenticated = result[1];
        if (isAuthenticated) return pages.slice(0, 2);
        else return pages.slice(2, 3);
      }),
    );

    this.topPages$ = combineLatest([
      this.topPagesComplete$,
      this.isAuthenticated$,
    ]).pipe(
      map((result) => {
        const pages = result[0];
        const isAuthenticated = result[1];
        if (isAuthenticated) return pages;
        else return pages.slice(0, 1);
      }),
    );
    this.translateService.setDefaultLang('en');
    this.deviceLanguageService.getLanguageCode().subscribe((languageCode) => {
      this.translateService.use(languageCode);
      this.topPages.next([
        {
          title: translateService.instant('MENU.HOME'),
          url: '/home',
          icon: 'home',
        },
        {
          title: translateService.instant('MENU.RESERVATIONS'),
          url: '/reservations',
          icon: 'folder',
        },
      ]);
      this.bottomPages.next([
        {
          title: translateService.instant('MENU.PROFILE'),
          url: '/profile',
          icon: 'person',
        },
        {
          title: translateService.instant('MENU.LOGOUT'),
          url: '/logout',
          icon: 'log-out',
        },
        {
          title: translateService.instant('MENU.LOGIN'),
          url: '/login',
          icon: 'log-in',
        },
      ]);
    });
  }

  ngOnInit(): void {
    get(
      `https://maps.googleapis.com/maps/api/js?key=${secretEnvironment.mapsKey}&libraries=places&language=ca`,
      () => {
        this.googleMapsLoaded = true;
      },
    );
  }
}
