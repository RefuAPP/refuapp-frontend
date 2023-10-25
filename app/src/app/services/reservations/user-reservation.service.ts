import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  distinctUntilChanged,
  map,
  mergeMap,
  Observable,
  of,
  retry,
  share,
  timer,
} from 'rxjs';
import { Reservations } from '../../schemas/reservations/reservation';
import { isFurtherAway, nightFromDate } from '../../schemas/night/night';
import { environment } from '../../../environments/environment';
import {
  fromError as fromReservationsError,
  fromResponse as fromReservationsResponse,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';
import { toReservations } from './common';

@Injectable({
  providedIn: 'root',
})
export class UserReservationService {
  constructor(private http: HttpClient) {}

  getReservationsForUserContinuous(
    userId: string,
    millisecondsToUpdate: number = 3000,
  ): Observable<Reservations> {
    return timer(0, millisecondsToUpdate)
      .pipe(
        mergeMap(() => this.getReservationsForUser(userId)),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .pipe(share());
  }

  private getReservationsForUser(userId: string): Observable<Reservations> {
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