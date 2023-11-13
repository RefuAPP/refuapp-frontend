import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { Observable } from 'rxjs';
import { getBottomItems, getTopItems } from './state/menu/menu.selector';
import { isLoading, LoadingState } from './state/loading/loading.selector';
import { librariesLoaded } from './state/init/init.selectors';

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
