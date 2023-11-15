import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Refuge } from '../../schemas/refuge/refuge';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { getReservationsSortedByRefuge } from '../../state/reservations/reservations.selectors';
import { map } from 'rxjs';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit {
  @Input() refuge!: Refuge;

  reservations = this.store.select(getReservationsSortedByRefuge).pipe(
    map((reservations) =>
      reservations.find(
        (reservation) => reservation.refuge.id === this.refuge.id,
      ),
    ),
    map((reservation) => {
      if (reservation === undefined) return [];
      return reservation.reservations;
    }),
  );

  constructor(
    private platform: Platform,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {}

  platformIsMobile(): boolean {
    return this.platform.is('mobile');
  }
}
