import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-internal-error-page',
  templateUrl: './internal-error-page.page.html',
  styleUrls: ['./internal-error-page.page.scss'],
})
export class InternalErrorPagePage implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  cleanError() {
    // TODO: here dispatch an action to clean the error
  }
}
