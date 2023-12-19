import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RefugeService } from '../../services/refuge/refuge.service';
import { Refuge } from '../../schemas/refuge/refuge';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import {
  ReservationWithId,
  ReservationWithoutUserId,
} from '../../schemas/reservations/reservation';
import { ModalController, Platform } from '@ionic/angular';
import { map, takeWhile, zip } from 'rxjs';
import { ReservationsComponentStore } from '../../pages/reservations/reservations.store';

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.page.html',
  styleUrls: ['./refuge.page.scss'],
  providers: [ReservationsComponentStore],
})
export class RefugePage {
  @Input() refuge!: Refuge;

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
    private modalCtrl: ModalController,
  ) {
    this.reservationsStore.fetchReservations(false);
  }

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return this.refugeService.getImageUrlFor(this.refuge);
  }

  refreshButton($event: any) {
    zip([this.reservationsStore.isLoading$])
      .pipe(takeWhile(([isLoading]) => isLoading))
      .subscribe({
        next: (v) => {
          console.log(JSON.stringify(v));
        },
        complete: () => {
          $event.target.complete();
        },
      });
    this.reservationsStore.fetchReservations(false);
  }

  openFullModal() {
    this.modalCtrl.getTop().then((modal) => {
      modal?.getCurrentBreakpoint().then((r) => {
        if (r == 1) modal?.setCurrentBreakpoint(0.3).then();
        if (r == 0.3) modal?.setCurrentBreakpoint(1).then();
      });
    });
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
