import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';
import { secretEnvironment } from '../environments/environment.secret';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { Observable } from 'rxjs';
import { getBottomItems, getTopItems } from './state/menu/menu.selector';
import { isLoading, LoadingState } from './state/loading/loading.selector';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  googleMapsLoaded = false;

  topMenuItems$ = this.store.select(getTopItems);
  bottomMenuItems$ = this.store.select(getBottomItems);
  isLoading$: Observable<LoadingState> = this.store.select(isLoading);

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
