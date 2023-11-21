import { Component, OnInit } from '@angular/core';
import { ReservationsComponentStore } from './reservations.store';
import { ReservationWithId } from '../../schemas/reservations/reservation';
import { takeUntil, takeWhile } from 'rxjs';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
  providers: [ReservationsComponentStore],
})
export class ReservationsPage implements OnInit {
  reservations$ = this.store.reservations$;

  constructor(private store: ReservationsComponentStore) {
    this.store.fetchReservations(false);
  }

  ngOnInit() {}

  removeReservation(reservation: ReservationWithId) {
    this.store.deleteReservation(reservation.id);
  }

  handleRefresh($event: any) {
    this.store.fetchReservations(true);
    this.store.isLoading$.pipe(takeWhile((isLoading) => isLoading)).subscribe({
      complete: () => {
        console.log('complete');
        $event.target.complete();
      },
    });
  }
}
