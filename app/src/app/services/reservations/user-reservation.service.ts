import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, mergeAll, Observable, of, retry } from 'rxjs';
import { Reservations } from '../../schemas/reservations/reservation';
import { isFurtherAway, nightFromDate } from '../../schemas/night/night';
import { environment } from '../../../environments/environment';
import {
  fromError as fromReservationsError,
  fromResponse as fromReservationsResponse,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';
import { toReservations } from './common';
import { RefugeService } from '../refuge/refuge.service';
import {
  orderByRefuge,
  RefugeReservationsRelations,
} from './grouped-by/refuge';

@Injectable({
  providedIn: 'root',
})
export class UserReservationService {
  constructor(
    private http: HttpClient,
    private refugeService: RefugeService,
  ) {}

  getReservationsGroupedByRefugeForUser(
    userId: string,
  ): Observable<RefugeReservationsRelations> {
    const reservationFactory = (refugeId: string) =>
      this.refugeService.getRefugeIgnoringErrorsFrom(refugeId);
    return this.getReservationsForUserFromCurrentDate(userId).pipe(
      map((reservations: Reservations) =>
        orderByRefuge(reservations, reservationFactory),
      ),
      mergeAll(),
    );
  }

  getReservationsForUserFromCurrentDate(
    userId: string,
  ): Observable<Reservations> {
    const reservationsWithErrors = this.getReservationsWithErrorsFor(userId);
    const reservations = toReservations(reservationsWithErrors);
    const night = nightFromDate(new Date());
    return reservations.pipe(
      map((reservations) =>
        reservations.filter((reservation) =>
          isFurtherAway(reservation.night, night),
        ),
      ),
    );
  }

  private getReservationsWithErrorsFor(
    userId: string,
  ): Observable<GetReservations> {
    const uri = this.getUriForUser(userId);
    return this.http.get<Reservations>(uri).pipe(
      map((reservations) => fromReservationsResponse(reservations)),
      catchError((err: HttpErrorResponse) => of(fromReservationsError(err))),
      retry(3),
    );
  }

  private getUriForUser(userId: string) {
    return `${environment.API}/reservations/user/${userId}`;
  }
}
