import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public topPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Reservations', url: '/reservations', icon: 'folder' },
  ];

  public bottomPages = [
    { title: 'Account', url: '/user', icon: 'person' },
    { title: 'Login', url: '/login', icon: 'log-in' },
    { title: 'Logout', url: '/logout', icon: 'log-out' },
  ];
  constructor() {}
}
