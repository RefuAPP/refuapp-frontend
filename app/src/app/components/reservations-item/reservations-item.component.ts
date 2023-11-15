import { Component, Input, OnInit } from '@angular/core';
import {
  Reservations,
  ReservationWithId,
} from '../../schemas/reservations/reservation';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { deleteReservation } from '../../state/reservations/reservations.actions';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-reservations-item',
  templateUrl: './reservations-item.component.html',
  styleUrls: ['./reservations-item.component.scss'],
})
export class ReservationsItemComponent implements OnInit {
  @Input() reservations: Reservations = [];

  constructor(
    private translateService: TranslateService,
    private alertController: AlertController,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {}

  onRemoveReservation(reservation: ReservationWithId) {
    this.showDeleteReservationMessage(reservation, () => {
      this.store.dispatch(deleteReservation({ id: reservation.id }));
    }).then();
  }

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
}
