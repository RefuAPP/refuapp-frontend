import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fromISOString } from '../../schemas/night/night';
import { Refuge } from '../../schemas/refuge/refuge';
import { TranslateService } from '@ngx-translate/core';
import { ReservationWithoutUserId } from '../../schemas/reservations/reservation';

@Component({
  selector: 'app-reservation-picker',
  templateUrl: './reservation-picker.component.html',
  styleUrls: ['./reservation-picker.component.scss'],
})
export class ReservationPickerComponent implements OnInit {
  @Input({ required: true }) refuge!: Refuge;
  @Output() reservation = new EventEmitter<ReservationWithoutUserId>();
  date = '';

  alertButtons = [this.translate.instant('REFUGE.RESERVATIONS.INFO.OKAY')];

  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  onBookClick() {
    const night = fromISOString(this.date);
    const reservation = {
      refuge_id: this.refuge.id,
      night,
    };
    this.reservation.emit(reservation);
  }

  getCurrentDate(): string {
    const date = new Date();
    return date.toISOString();
  }
}
