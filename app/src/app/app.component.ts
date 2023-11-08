import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';
import { secretEnvironment } from '../environments/environment.secret';
import { Store } from '@ngrx/store';
import { getBottomItems, getTopItems } from './state/auth/auth.selectors';
import { AppState } from './state/app.state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  googleMapsLoaded = false;

  topMenuItems$ = this.store.select(getTopItems);
  bottomMenuItems$ = this.store.select(getBottomItems);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    get(
      `https://maps.googleapis.com/maps/api/js?key=${secretEnvironment.mapsKey}&libraries=places&language=ca`,
      () => {
        this.googleMapsLoaded = true;
      },
    );
  }
}
