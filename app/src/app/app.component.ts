import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public topPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Reservations', url: '/reservations', icon: 'folder' },
  ];

  public bottomPages = [
    { title: 'Account', url: '/user', icon: 'person' },
    { title: 'Logout', url: '/logout', icon: 'log-out' },
    { title: 'Login', url: '/login', icon: 'log-in' },
  ];
  constructor(private authService: AuthService) {}

  // @ts-ignore
  bottomPagesPromise: Promise<{ title: string; url: string; icon: string }[]>;
  // @ts-ignore
  topPagesPromise: Promise<{ title: string; url: string; icon: string }[]>;

  ngOnInit() {
    this.bottomPagesPromise = this.getBottomPages();
    this.topPagesPromise = this.getTopPages();
  }

  public async getBottomPages() {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) return this.bottomPages.slice(0, 2);
    else return this.bottomPages.slice(2, 3);
  }

  public async getTopPages() {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) return this.topPages;
    else return this.topPages.slice(0, 1);
  }
}
