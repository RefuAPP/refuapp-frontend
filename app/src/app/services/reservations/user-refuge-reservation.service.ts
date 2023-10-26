import { Injectable } from '@angular/core';
import { isFurtherAway, Night, nightFromDate } from '../../schemas/night/night';
import {
  catchError,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  mergeAll,
  mergeMap,
  Observable,
  of,
  retry,
  share,
  timer,
} from 'rxjs';
import {
  Reservations,
  ReservationWithId,
} from '../../schemas/reservations/reservation';
import { isMatching } from 'ts-pattern';
import {
  CorrectGetReservations,
  ErrorGetReservationsPattern,
  fromError as fromReservationsError,
  fromResponse as fromReservationsResponse,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Refuge } from '../../schemas/refuge/refuge';
import { CorrectGetRefugeResponse } from '../../schemas/refuge/get-refuge-schema';

@Injectable({
  providedIn: 'root',
})
export class UserRefugeReservationService {
  constructor(private http: HttpClient) {}

  getReservationsForRefugeAndUserFromToday(
    refugeId: string,
    userId: string,
  ): Observable<Reservations> {
    return timer(0, 3_000)
      .pipe(
        mergeMap(() => {
          const today = new Date();
          const night = nightFromDate(today);
          return this.getReservationsForRefugeAndUserFrom(
            refugeId,
            userId,
            night,
          );
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .pipe(share());
  }

  private getReservationsForRefugeAndUserFrom(
    refugeId: string,
    userId: string,
    night: Night,
  ): Observable<Reservations> {
    return this.getReservationsForRefugeAndUser(refugeId, userId).pipe(
      map((response) => {
        if (isMatching(ErrorGetReservationsPattern, response)) return [];
        return (response as CorrectGetReservations).reservations;
      }),
      map((reservations) =>
        reservations.filter((reservation) =>
          isFurtherAway(reservation.night, night),
        ),
      ),
    );
  }

  private getReservationsForRefugeAndUser(
    refugeId: string,
    userId: string,
  ): Observable<GetReservations> {
    const uri = this.getUriForUserAndRefuge(refugeId, userId);
    return this.http.get<Reservations>(uri).pipe(
      map((reservations) => fromReservationsResponse(reservations)),
      catchError((err: HttpErrorResponse) => of(fromReservationsError(err))),
      retry(3),
    );
  }

  private getUriForUserAndRefuge(refugeId: string, userId: string) {
    return `${environment.API}/reservations/refuge/${refugeId}/user/${userId}`;
  }
}
