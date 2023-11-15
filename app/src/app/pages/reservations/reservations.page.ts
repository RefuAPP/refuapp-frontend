import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { getReservationsSortedByRefuge } from '../../state/reservations/reservations.selectors';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  reservations$ = this.store.select(getReservationsSortedByRefuge);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}
}
