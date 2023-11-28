import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { fixFatalError } from '../../state/errors/error.actions';

@Component({
  selector: 'app-programming-error',
  templateUrl: './programming-error.page.html',
  styleUrls: ['./programming-error.page.scss'],
})
export class ProgrammingErrorPage {
  constructor(private store: Store<AppState>) {}

  cleanError() {
    this.store.dispatch(fixFatalError());
  }
}
