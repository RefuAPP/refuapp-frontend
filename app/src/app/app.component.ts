import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { concatMap, filter, Observable, tap } from 'rxjs';
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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  topMenuItems$ = this.store.select(getTopItems);
  bottomMenuItems$ = this.store.select(getBottomItems);

  hasConnectionError$: Observable<boolean> = this.store.select(
    clientHasErrorConnection,
  );
  private minorErrors$ = this.store
    .select(getMinorErrors)
    .pipe(filter((errors) => errors !== undefined)) as Observable<MinorError>;
  private messages$ = this.store
    .select(getMessages)
    .pipe(filter((message) => message !== undefined)) as Observable<Message>;

  constructor(
    private store: Store<AppState>,
    private toast: ToastController,
    private translateService: TranslateService,
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
      message: this.translateService.instant(message.message, message.props),
      ...options,
    });
    await element.present();
    await element.onDidDismiss();
    return message.id;
  }

  getAlertButtons() {
    return [
      {
        text: this.translateService.instant('HOME.CLIENT_ERROR.OKAY_BUTTON'),
        role: 'confirm',
        handler: () => {
          this.store.dispatch(fixFatalError());
        },
      },
    ];
  }
}
