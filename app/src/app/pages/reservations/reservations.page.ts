import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservationWithId } from '../../schemas/reservations/reservation';
import { UserReservationService } from '../../services/reservations/user-reservation.service';
import { AuthService } from '../../services/auth/auth.service';
import { RefugeReservationsRelations } from '../../services/reservations/grouped-by/refuge';
import { ReservationsService } from '../../services/reservations/reservations.service';
import { AlertController, ToastController } from '@ionic/angular';
import {
  DeleteReservation,
  DeleteReservationError,
  ErrorDeleteReservation,
} from '../../schemas/reservations/delete-reservation';
import { match } from 'ts-pattern';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  reservations?: Observable<RefugeReservationsRelations>;

  onRemoveReservation(reservation: ReservationWithId) {
    this.showDeleteReservationMessage(reservation, () => {
      this.removeReservation(reservation);
    }).then();
  }

  constructor(
    userReservationService: UserReservationService,
    private reservationService: ReservationsService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    this.authService.getUserId().then((userId) => {
      if (userId == null) {
        console.log('TODO: handle user not logged in');
        return;
      }
      this.reservations =
        userReservationService.getReservationsGroupedByRefugeForUser(userId);
    });
  }

  private removeReservation(reservation: ReservationWithId) {
    this.reservationService.deleteReservation(reservation.id).subscribe({
      next: (response) => this.handleDeleteResponse(response),
      error: () => this.handleConnectionOrServerDown().then(),
    });
  }

  private handleDeleteResponse(response: DeleteReservation) {
    match(response)
      .with({ status: 'ok' }, () => this.showReservationDeletedMessage())
      .with({ status: 'error' }, (error) => this.handleError(error))
      .exhaustive();
  }

  private handleError(response: ErrorDeleteReservation) {
    match(response.error)
      .with(DeleteReservationError.RESERVATION_NOT_FOUND, () =>
        this.handleReservationNotFound(),
      )
      .with(
        DeleteReservationError.NOT_AUTHENTICATED,
        DeleteReservationError.PROGRAMMING_ERROR,
        DeleteReservationError.SERVER_ERROR,
        DeleteReservationError.NOT_ALLOWED_DELETION_FOR_USER,
        () => this.handleProgrammingErrors(),
      )
      .with(DeleteReservationError.UNKNOWN_ERROR, () =>
        this.handleUnknownError(),
      )
      .exhaustive();
  }

  private async handleConnectionOrServerDown() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'The client is failing',
      message:
        'Is your internet connection working? Maybe is our fault and our server is down.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.alertController.dismiss().then();
          },
        },
      ],
    });
    return await alert.present();
  }

  private async showDeleteReservationMessage(
    reservation: ReservationWithId,
    onClick: () => void,
  ) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Vols eliminar la reserva?',
      message: `Vols eliminar la reserva per al dia ${reservation.night.day}?`,
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.alertController.dismiss().then();
            onClick();
          },
        },
      ],
    });
    return await alert.present();
  }

  private showReservationDeletedMessage() {
    this.toastController
      .create({
        message: 'Reserva eliminada',
        duration: 2000,
        color: 'success',
      })
      .then((toast) => toast.present());
  }

  private handleReservationNotFound() {
    this.toastController
      .create({
        message: 'La Reserva no existeix, potser ja ha estat eliminada',
        duration: 2000,
        color: 'danger',
      })
      .then((toast) => toast.present());
  }

  ngOnInit() {}

  private handleProgrammingErrors() {
    this.router
      .navigate(['programming-error'], {
        skipLocationChange: true,
      })
      .then();
  }

  private handleUnknownError() {
    this.router
      .navigate(['internal-error-page'], {
        skipLocationChange: true,
      })
      .then();
  }
}
