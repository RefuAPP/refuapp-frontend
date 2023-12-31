import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { fixFatalError } from '../../state/errors/error.actions';

@Component({
  selector: 'app-internal-error-page',
  templateUrl: './internal-error-page.page.html',
  styleUrls: ['./internal-error-page.page.scss'],
})
export class InternalErrorPagePage {
  constructor(private store: Store<AppState>) {}

  cleanError() {
    this.store.dispatch(fixFatalError());
  }
}
