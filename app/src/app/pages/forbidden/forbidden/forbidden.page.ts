import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../state/app.state';
import { Store } from '@ngrx/store';
import { fixFatalError } from '../../../state/errors/error.actions';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.page.html',
  styleUrls: ['./forbidden.page.scss'],
})
export class ForbiddenPage implements OnInit {
  constructor(private readonly store: Store<AppState>) {}

  ngOnInit() {}

  cleanError() {
    this.store.dispatch(fixFatalError());
  }
}
