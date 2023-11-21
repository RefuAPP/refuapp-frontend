import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RefugeService } from '../../services/refuge/refuge.service';
import { Refuge } from '../../schemas/refuge/refuge';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { loadRefuges } from '../../state/refuges/refuges.actions';
import {
  ReservationWithId,
  ReservationWithoutUserId,
} from '../../schemas/reservations/reservation';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs';
import { ReservationsComponentStore } from '../../pages/reservations/reservations.store';

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.page.html',
  styleUrls: ['./refuge.page.scss'],
  providers: [ReservationsComponentStore],
})
export class RefugePage {
  @Input() refuge?: Refuge;
  @Output() clickedBar = new EventEmitter();

  reservations = this.reservationsStore.reservations$.pipe(
    map((reservations) => {
      const x = reservations.find(
        (reservation) => reservation.refuge.id == this.refuge?.id,
      );
      if (x === undefined) return [];
      return x.reservations;
    }),
  );

  constructor(
    private refugeService: RefugeService,
    private store: Store<AppState>,
    private reservationsStore: ReservationsComponentStore,
    private platform: Platform,
  ) {
    this.reservationsStore.fetchReservations();
  }

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return this.refugeService.getImageUrlFor(this.refuge);
  }

  refreshButton() {
    this.store.dispatch(loadRefuges());
    // TODO: fetch reservations here
  }

  openFullModal() {
    this.clickedBar.emit();
  }

  platformIsMobile(): boolean {
    return this.platform.is('mobile');
  }

  deleteReservation($event: ReservationWithId) {
    this.reservationsStore.deleteReservation($event.id);
  }

  createReservation($event: ReservationWithoutUserId) {
    this.reservationsStore.createReservation($event);
  }
}
