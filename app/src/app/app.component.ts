import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { Observable } from 'rxjs';
import { librariesLoaded } from './state/init/init.selectors';
import {
  isLoading,
  LoadingState,
} from './state/components/loading/loading.selector';
import {
  getBottomItems,
  getTopItems,
} from './state/components/menu/menu.selector';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  topMenuItems$ = this.store.select(getTopItems);
  bottomMenuItems$ = this.store.select(getBottomItems);
  isLoading$: Observable<LoadingState> = this.store.select(isLoading);
  librariesAreLoaded$: Observable<boolean> = this.store.select(librariesLoaded);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}
}
