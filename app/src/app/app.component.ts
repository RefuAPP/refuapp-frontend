import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { concatMap, filter, Observable, tap } from 'rxjs';
import { areLibrariesLoaded } from './state/init/init.selectors';
import {
  clientHasErrorConnection,
  getMinorErrors,
} from './state/errors/error.selectors';
import { fixFatalError, fixMinorError } from './state/errors/error.actions';
import { getMessages } from './state/messages/message.selectors';
import { ToastController, ToastOptions } from '@ionic/angular';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Message } from './state/messages/message.reducer';
import { clearMessage } from './state/messages/message.actions';
import { MinorError } from './state/errors/error.reducer';
import { getBottomItems, getTopItems } from './state/auth/auth.selectors';
import { isMapLoading } from './state/map/map.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  topMenuItems$ = this.store.select(getTopItems);
  bottomMenuItems$ = this.store.select(getBottomItems);
  isMapLoading$: Observable<boolean> = this.store.select(isMapLoading);
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
  private minorErrors$ = this.store
    .select(getMinorErrors)
    .pipe(filter((errors) => errors !== undefined)) as Observable<MinorError>;
  private messages$ = this.store
    .select(getMessages)
    .pipe(filter((message) => message !== undefined)) as Observable<Message>;

  constructor(
    private store: Store<AppState>,
    private toast: ToastController,
  ) {
    this.minorErrors$
      .pipe(
        takeUntilDestroyed(),
        concatMap((message) =>
          fromPromise(
            this.showToast(message, {
              color: 'danger',
              icon: 'alert-circle-outline',
              duration: 3000,
              position: 'bottom',
            }),
          ),
        ),
        tap((id) => this.store.dispatch(fixMinorError({ id }))),
      )
      .subscribe();
    this.messages$
      .pipe(
        takeUntilDestroyed(),
        concatMap((message) =>
          fromPromise(
            this.showToast(message, {
              color: 'success',
              icon: 'checkmark-circle-outline',
              duration: 3000,
              position: 'bottom',
            }),
          ),
        ),
        tap((id) => this.store.dispatch(clearMessage({ id }))),
      )
      .subscribe();
  }

  private async showToast(message: Message, options: ToastOptions) {
    const element = await this.toast.create({
      message: message.message,
      ...options,
    });
    await element.present();
    await element.onDidDismiss();
    return message.id;
  }

  ngOnInit(): void {}
}
