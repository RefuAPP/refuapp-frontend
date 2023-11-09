import { Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';
import { secretEnvironment } from '../environments/environment.secret';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { Observable } from 'rxjs';
import { getBottomItems, getTopItems } from './state/menu/menu.selector';
import { isLoading, LoadingState } from './state/loading/loading.selector';
import { appIsLoadingLibraries } from './state/init/init.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  topMenuItems$ = this.store.select(getTopItems);
  bottomMenuItems$ = this.store.select(getBottomItems);
  isLoading$: Observable<LoadingState> = this.store.select(isLoading);
  isLoadingApp$: Observable<boolean> = this.store.select(appIsLoadingLibraries);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}
}
