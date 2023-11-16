import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { filter, mergeMap, Observable, tap } from 'rxjs';
import { areLibrariesLoaded } from './state/init/init.selectors';
import {
  isLoading,
  LoadingState,
} from './state/components/loading/loading.selector';
import {
  getBottomItems,
  getTopItems,
} from './state/components/menu/menu.selector';
import {
  clientHasErrorConnection,
  getMinorErrors,
  hasMinorErrors,
} from './state/errors/error.selectors';
import { fixFatalError, fixMinorError } from './state/errors/error.actions';
import {
  getMessages,
  hasMessages,
  selectMessages,
} from './state/messages/message.selectors';
import { clearMessage } from './state/messages/message.actions';
import { ToastController } from '@ionic/angular';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
        this.store.dispatch(fixFatalError());
      },
    },
  ];
  hasConnectionError$: Observable<boolean> = this.store.select(
    clientHasErrorConnection,
  );
  canShowPage$ = this.store.select(areLibrariesLoaded);

  minorErrors$ = this.store
    .select(getMinorErrors)
    .pipe(filter((errors) => errors !== undefined)) as Observable<string>;
  messages$ = this.store
    .select(getMessages)
    .pipe(filter((messages) => messages !== undefined)) as Observable<string>;

  constructor(
    private store: Store<AppState>,
    private toast: ToastController,
  ) {
    this.minorErrors$
      .pipe(
        takeUntilDestroyed(),
        mergeMap((message) =>
          fromPromise(
            this.toast.create({
              message: message,
              color: 'danger',
              icon: 'alert-circle-outline',
              duration: 3000,
              position: 'bottom',
            }),
          ),
        ),
        mergeMap((toast) => fromPromise(toast.present())),
        tap(() => this.store.dispatch(fixMinorError())),
      )
      .subscribe();
    this.messages$
      .pipe(
        takeUntilDestroyed(),
        mergeMap((message) =>
          fromPromise(
            this.toast.create({
              message: message,
              color: 'success',
              icon: 'checkmark-circle-outline',
              duration: 3000,
              position: 'bottom',
            }),
          ),
        ),
        mergeMap((toast: HTMLIonToastElement) => fromPromise(toast.present())),
        tap(() => this.store.dispatch(clearMessage())),
      )
      .subscribe();
  }

  ngOnInit(): void {}
}
