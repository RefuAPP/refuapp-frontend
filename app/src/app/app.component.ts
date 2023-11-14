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
import { clientHasErrorConnection } from './state/errors/error.selectors';
import { cleanError } from './state/errors/error.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  topMenuItems$ = this.store.select(getTopItems);
  bottomMenuItems$ = this.store.select(getBottomItems);
  isLoading$: Observable<LoadingState> = this.store.select(isLoading);
  public alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.store.dispatch(cleanError());
      },
    },
  ];
  hasConnectionError$: Observable<boolean> = this.store.select(
    clientHasErrorConnection,
  );
  canShowPage$ = this.store.select(areLibrariesLoaded);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}
}
