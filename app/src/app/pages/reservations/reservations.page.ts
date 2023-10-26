import { Component, OnInit } from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  mergeMap,
  Observable,
  scan,
} from 'rxjs';
import {
  Reservation,
  Reservations,
  ReservationWithId,
} from '../../schemas/reservations/reservation';
import { Router } from '@angular/router';
import { UserReservationService } from '../../services/reservations/user-reservation.service';
import { AuthService } from '../../services/auth/auth.service';
import { Refuge } from '../../schemas/refuge/refuge';
import { RefugeService } from '../../services/refuge/refuge.service';
import { CorrectGetRefugeResponse } from '../../schemas/refuge/get-refuge-schema';

export type A = {
  refuge: Refuge;
  reservations: Reservations;
};

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  reservations?: Observable<{ refuge: Refuge; reservations: Reservations }[]>;

  onReservationClick(session: Reservation) {
    this.router.navigate([`/home`, session.refuge_id]).then();
  }

  onRemoveReservation(session: Reservation) {
    console.log('Remove reservation', session);
  }

  constructor(
    private reservationService: UserReservationService,
    private refugeService: RefugeService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.getUserId().then((userId) => {
      if (userId == null) {
        console.log('TODO: handle user not logged in');
        return;
      }
      this.reservations = this.getReservationSortedByRefuge(userId);
      this.reservations.subscribe((reservations) => console.log(reservations));
    });
  }

  private getReservationWithRefuge(
    userId: string,
  ): Observable<{ refuge: Refuge; reservation: ReservationWithId }[]> {
    return this.reservationService
      .getReservationsForUserContinuous(userId)
      .pipe(
        mergeMap((reservations: Reservations) => {
          const reservationsWithRefuge = reservations.map((reservation) =>
            this.refugeService.getRefugeFrom(reservation.refuge_id).pipe(
              filter(
                (response): response is CorrectGetRefugeResponse =>
                  response.status === 'correct',
              ),
              map((response) => ({
                refuge: response.data,
                reservation: reservation,
              })),
            ),
          );
          return forkJoin(reservationsWithRefuge);
        }),
      );
  }

  private getReservationSortedByRefuge(userId: string): Observable<
    {
      refuge: Refuge;
      reservations: ReservationWithId[];
    }[]
  > {
    return this.getReservationWithRefuge(userId).pipe(
      mergeMap((data) => data), // Flatten the array
      scan((acc, curr) => {
        const { refuge, reservation } = curr;
        const refugeId = refuge.id;
        if (!acc.has(refugeId)) {
          acc.set(refugeId, { refuge, reservations: [] });
          // @ts-ignore
        } else if (
          acc
            .get(refugeId)
            .reservations?.find((r) => r.id === reservation.id) !== undefined
        ) {
          console.log('Reservation already exists');
        } else {
          // @ts-ignore
          acc.get(refugeId).reservations.push(reservation);
        }
        return acc;
      }, new Map<string, { refuge: Refuge; reservations: ReservationWithId[] }>()),
      map((reservationsMap) => Array.from(reservationsMap.values())),
      distinctUntilChanged(), // Ensures that only distinct arrays are emitted
    );
  }

  ngOnInit() {}
}
