import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { Observable } from 'rxjs';
import { areLibrariesLoaded } from './state/init/init.selectors';
import {
  isLoading,
  LoadingState,
} from './state/components/loading/loading.selector';
import {
  getBottomItems,
  getTopItems,
} from './state/components/menu/menu.selector';
import { isMapLoading } from './state/map/map.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  topMenuItems$ = this.store.select(getTopItems);
  bottomMenuItems$ = this.store.select(getBottomItems);
  isLoading$: Observable<LoadingState> = this.store.select(isLoading);
  librariesAreLoaded$: Observable<boolean> =
    this.store.select(areLibrariesLoaded);
  isMapLoading$: Observable<boolean> = this.store.select(isMapLoading);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}
}
