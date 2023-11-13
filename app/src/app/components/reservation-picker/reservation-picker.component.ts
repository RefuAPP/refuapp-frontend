import { Component, Input, OnInit } from '@angular/core';
import { fromISOString } from '../../schemas/night/night';
import { AuthService } from '../../services/auth/auth.service';
import { Refuge } from '../../schemas/refuge/refuge';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { addReservation } from '../../state/reservations/reservations.actions';
import { getCreateReservationErrors } from '../../state/reservations/reservations.selectors';

@Component({
  selector: 'app-reservation-picker',
  templateUrl: './reservation-picker.component.html',
  styleUrls: ['./reservation-picker.component.scss'],
})
export class ReservationPickerComponent implements OnInit {
  @Input({ required: true }) refuge!: Refuge;
  date = '';

  createErrors = this.store.select(getCreateReservationErrors);

  constructor(private store: Store<AppState>) {
    this.createErrors.subscribe((errors) => {
      console.log(errors);
    });
  }

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
