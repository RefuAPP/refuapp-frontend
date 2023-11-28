import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { fixFatalError } from '../../state/errors/error.actions';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.page.html',
  styleUrls: ['./not-found-page.page.scss'],
})
export class NotFoundPagePage {
  constructor(private store: Store<AppState>) {}

  cleanError() {
    this.store.dispatch(fixFatalError());
  }
}
