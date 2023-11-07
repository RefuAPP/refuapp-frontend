import { Component, Input, OnInit } from '@angular/core';
import { fromISOString } from '../../schemas/night/night';
import {
  CreateReservation,
  CreateReservationError,
} from '../../schemas/reservations/create-reservation';
import { match } from 'ts-pattern';
import { Reservation } from '../../schemas/reservations/reservation';
import { Color } from '@ionic/core';
import { AuthService } from '../../services/auth/auth.service';
import { ReservationsService } from '../../services/reservations/reservations.service';
import { Refuge } from '../../schemas/refuge/refuge';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reservation-picker',
  templateUrl: './reservation-picker.component.html',
  styleUrls: ['./reservation-picker.component.scss'],
})
export class ReservationPickerComponent implements OnInit {
  @Input({ required: true }) refuge!: Refuge;
  date = '';

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private translateService: TranslateService,
    private reservationService: ReservationsService,
  ) {}

  ngOnInit() {}

  onBookClick() {
    const night = fromISOString(this.date);
    this.authService.getUserId().then((userId) => {
      if (userId === null) return;
      if (this.refuge === undefined) return;
      this.reservationService
        .createReservation(userId, this.refuge.id, night)
        .subscribe({
          next: (response) => {
            this.handleCreateReservationResponse(response);
          },
          error: () => {
            this.handleClientErrorOnCreateReservation();
          },
        });
    });
  }

  getCurrentDate(): string {
    const date = new Date();
    return date.toISOString();
  }

  private handleCreateReservationResponse(response: CreateReservation) {
    match(response)
      .with({ status: 'ok' }, (response) => {
        this.handleCorrectCreateReservation(response.reservation);
      })
      .with({ status: 'error' }, (response) => {
        this.handleCreateReservationError(response.error);
      })
      .exhaustive();
  }

  private handleCorrectCreateReservation(reservation: Reservation) {
    this.showToast(
      'RESERVATIONS.CREATE_OPERATION.CORRECT',
      { day: reservation.night.day },
      'success',
    );
  }

  private handleCreateReservationError(error: CreateReservationError) {
    match(error)
      .with(CreateReservationError.NOT_AUTHENTICATED_OR_INVALID_DATE, () => {
        this.showToast(
          'RESERVATIONS.CREATE_OPERATION.NOT_AUTHENTICATED_OR_INVALID_DATE',
          {},
          'danger',
        );
      })
      .with(CreateReservationError.NOT_ALLOWED_CREATION_FOR_USER, () => {
        this.showToast(
          'RESERVATIONS.CREATE_OPERATION.NOT_ALLOWED_CREATION_FOR_USER',
          {},
          'danger',
        );
      })
      .with(CreateReservationError.PROGRAMMING_ERROR, () => {
        this.showToast(
          'RESERVATIONS.CREATE_OPERATION.PROGRAMMING_ERROR',
          {},
          'danger',
        );
      })
      .with(CreateReservationError.REFUGE_OR_USER_NOT_FOUND, () => {
        this.showToast(
          'RESERVATIONS.CREATE_OPERATION.REFUGE_OR_USER_NOT_FOUND',
          {},
          'danger',
        );
      })
      .with(
        CreateReservationError.SERVER_ERROR,
        CreateReservationError.UNKNOWN_ERROR,
        CreateReservationError.NTP_SERVER_IS_DOWN,
        () => {
          this.showToast(
            'RESERVATIONS.CREATE_OPERATION.SERVER_ERROR',
            {},
            'danger',
          );
        },
      )
      .exhaustive();
  }

  private showToast(messageKey: string, props: any, color: Color) {
    this.toastController
      .create({
        message: this.translateService.instant(messageKey, props),
        duration: 2000,
        color: color,
      })
      .then((toast) => toast.present());
  }

  private handleClientErrorOnCreateReservation() {}
}
