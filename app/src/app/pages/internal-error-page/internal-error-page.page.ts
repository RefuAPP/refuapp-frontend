import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { cleanError } from '../../state/errors/error.actions';

@Component({
  selector: 'app-internal-error-page',
  templateUrl: './internal-error-page.page.html',
  styleUrls: ['./internal-error-page.page.scss'],
})
export class InternalErrorPagePage implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  cleanError() {
    this.store.dispatch(cleanError());
  }
}
