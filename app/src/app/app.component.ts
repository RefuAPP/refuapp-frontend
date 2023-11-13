import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { combineLatest, map, Observable } from 'rxjs';
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
import { hasError } from './state/errors/error.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  topMenuItems$ = this.store.select(getTopItems);
  bottomMenuItems$ = this.store.select(getBottomItems);
  isLoading$: Observable<LoadingState> = this.store.select(isLoading);
  isMapLoading$: Observable<boolean> = this.store.select(isMapLoading);
  hasError$: Observable<boolean> = this.store.select(hasError);
  librariesAreLoaded$: Observable<boolean> =
    this.store.select(areLibrariesLoaded);
  canShowPage$ = combineLatest([this.librariesAreLoaded$, this.hasError$]).pipe(
    map(([librariesAreLoaded, hasError]) => librariesAreLoaded || hasError),
  );

  constructor(private store: Store<AppState>) {
    this.canShowPage$.subscribe((canShowPage) => {
      console.log('canShowPage', canShowPage);
    });
  }

  ngOnInit(): void {}
}
