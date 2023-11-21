import { Component, OnInit } from '@angular/core';
import { ReservationsComponentStore } from './reservations.store';
import { ReservationWithId } from '../../schemas/reservations/reservation';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
  providers: [ReservationsComponentStore],
})
export class ReservationsPage implements OnInit {
  reservations$ = this.store.reservations$;

  constructor(private store: ReservationsComponentStore) {
    this.store.fetchReservations();
  }

  ngOnInit() {}

  removeReservation(reservation: ReservationWithId) {
    this.store.deleteReservation(reservation.id);
  }
}
