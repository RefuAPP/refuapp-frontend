import { Component, OnInit } from '@angular/core';
import {
  deletedReservation,
  getDeleteReservationErrors,
} from '../../state/reservations/reservations.selectors';
import { filter, map, OperatorFunction } from 'rxjs';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-reactive-reservations',
  templateUrl: './reactive-reservations.component.html',
  styleUrls: ['./reactive-reservations.component.scss'],
})
export class ReactiveReservationsComponent implements OnInit {
  deleteErrors$ = this.store
    .select(getDeleteReservationErrors)
    .pipe(
      filter((errors) => errors !== null) as OperatorFunction<
        string | null,
        any
      >,
    );
  hasDeletionErrors$ = this.store
    .select(getDeleteReservationErrors)
    .pipe(map((errors) => errors !== null));
  deletedReservation$ = this.store.select(deletedReservation);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}
}
