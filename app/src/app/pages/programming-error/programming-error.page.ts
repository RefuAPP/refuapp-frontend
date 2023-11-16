import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-programming-error',
  templateUrl: './programming-error.page.html',
  styleUrls: ['./programming-error.page.scss'],
})
export class ProgrammingErrorPage implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  cleanError() {
    // TODO: here dispatch an action to clean the error
  }
}
