import { Component, Input, OnInit } from '@angular/core';
import { fromISOString } from '../../schemas/night/night';
import { Refuge } from '../../schemas/refuge/refuge';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { addReservation } from '../../state/reservations/reservations.actions';

@Component({
  selector: 'app-reservation-picker',
  templateUrl: './reservation-picker.component.html',
  styleUrls: ['./reservation-picker.component.scss'],
})
export class ReservationPickerComponent implements OnInit {
  @Input({ required: true }) refuge!: Refuge;
  date = '';

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  onBookClick() {
    const night = fromISOString(this.date);
    const reservation = {
      refuge_id: this.refuge.id,
      night,
    };
    this.store.dispatch(addReservation({ reservation }));
  }

  getCurrentDate(): string {
    const date = new Date();
    return date.toISOString();
  }
}
