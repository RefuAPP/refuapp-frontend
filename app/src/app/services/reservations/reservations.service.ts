import { Injectable } from '@angular/core';
import {
  catchError,
  forkJoin,
  map,
  mergeAll,
  Observable,
  of,
  retry,
} from 'rxjs';
import {
  getNightsFrom,
  isBigger,
  Night,
  Reservation,
  Reservations,
} from '../../schemas/reservations/reservation';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isMatching } from 'ts-pattern';
import {
  fromError as fromReservationError,
  fromResponse as fromReservationResponse,
  GetReservation,
} from '../../schemas/reservations/get-reservation';
import {
  CorrectGetReservations,
  ErrorGetReservationsPattern,
  fromError as fromRefugeAndUserError,
  fromResponse as fromRefugeAndUserResponse,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  getReservationsForUser(userId: string): Observable<Reservations> {
    return of([]);
  }

  /**
   * Get reservations for a refuge and a number of days from now
   * @param refugeId
   * @param daysFromNow
   */
  getReservationsForRefuge(
    refugeId: string,
    daysFromNow: number,
  ): Observable<{
    night: Night;
    reservations: Reservations;
  }> {
    const today = new Date();
    const nights = getNightsFrom(today, daysFromNow);
    const reservations = nights.map((night) => {
      return this.getReservationsForRefugeAndNight(refugeId, night).pipe(
        map((reservations) => {
          if (isMatching(ErrorGetReservationsPattern, reservations))
            return {
              night: night,
              reservations: [],
            };
          return {
            night: night,
            reservations: (reservations as CorrectGetReservations).reservations,
          };
        }),
      );
    });
    return forkJoin(reservations).pipe(mergeAll());
  }

  /**
   * Get reservations for a refuge and one night
   * @param refugeId
   * @param night
   */
  getReservationsForRefugeAndNight(
    refugeId: string,
    night: Night,
  ): Observable<GetReservations> {
    const uri = this.getUriForRefugeAndNight(refugeId, night);
    return this.http.get<Reservations>(uri).pipe(
      map((reservations) => fromRefugeAndUserResponse(reservations)),
      catchError((err: HttpErrorResponse) => of(fromRefugeAndUserError(err))),
      retry(3),
    );
  }

  /**
   * Get a reservation from its id
   * @param reservationId
   */
  getReservation(reservationId: string): Observable<GetReservation> {
    const reservationUri = this.getUriForReservation(reservationId);
    return this.http.get<Reservation>(reservationUri).pipe(
      map((reservation) => fromReservationResponse(reservation)),
      catchError((err: HttpErrorResponse) => of(fromReservationError(err))),
      retry(3),
    );
  }

  /**
   * Get reservations from a given night for a refuge and a user.
   * In case of error, returns an empty array (no reservations)
   * @param refugeId
   * @param userId
   * @param night
   */
  getReservationsForRefugeAndUserFrom(
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
          isBigger(reservation.night, night),
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
      map((reservations) => fromRefugeAndUserResponse(reservations)),
      catchError((err: HttpErrorResponse) => of(fromRefugeAndUserError(err))),
      retry(3),
    );
  }

  private getUriForUserAndRefuge(refugeId: string, userId: string) {
    return `${environment.API}/reservations/refuge/${refugeId}/user/${userId}`;
  }

  private getUriForUser(userId: string) {
    return `${environment.API}/reservations/user/${userId}`;
  }

  private getUriForRefugeAndNight(refugeId: string, night: Night) {
    return `${environment.API}/reservations/refuge/${refugeId}/year/${night.year}/month/${night.month}/day/${night.day}}`;
  }

  private getUriForReservation(reservationId: string) {
    return `${environment.API}/reservations/${reservationId}`;
  }
}
