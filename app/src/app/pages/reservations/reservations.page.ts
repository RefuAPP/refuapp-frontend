import { Component, OnInit } from '@angular/core';
import { ReservationWithId } from '../../schemas/reservations/reservation';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { deleteReservation } from '../../state/reservations/reservations.actions';
import {
  deletedReservation,
  getDeleteReservationErrors,
  getReservationsSortedByRefuge,
} from '../../state/reservations/reservations.selectors';
import { filter, map, OperatorFunction } from 'rxjs';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  reservations$ = this.store.select(getReservationsSortedByRefuge);
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

  onRemoveReservation(reservation: ReservationWithId) {
    this.showDeleteReservationMessage(reservation, () => {
      this.store.dispatch(deleteReservation({ id: reservation.id }));
    }).then();
  }

  constructor(
    private store: Store<AppState>,
    private alertController: AlertController,
    private translateService: TranslateService,
  ) {}

  private async showDeleteReservationMessage(
    reservation: ReservationWithId,
    onClick: () => void,
  ) {
    const alert = await this.alertController.create({
      header: this.translateService.instant('RESERVATIONS.DELETE_ALERT.HEADER'),
      subHeader: this.translateService.instant(
        'RESERVATIONS.DELETE_ALERT.SUBHEADER',
      ),
      message: this.translateService.instant(
        'RESERVATIONS.DELETE_ALERT.MESSAGE',
        { day: reservation.night.day },
      ),
      buttons: [
        {
          text: this.translateService.instant(
            'RESERVATIONS.DELETE_ALERT.BUTTON',
          ),
          handler: () => {
            this.alertController.dismiss().then();
            onClick();
          },
        },
      ],
    });
    return await alert.present();
  }

  ngOnInit() {}
}
