import { Injectable } from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
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
  fromError as fromReservationsError,
  fromResponse as fromReservationsResponse,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';
import {
  getNightsFrom,
  isFurtherAway,
  Night,
  nightFromDate,
} from '../../schemas/night/night';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  getReservationsForUserFromToday(userId: string): Observable<Reservations> {
    const reservationsWithErrors = this.getReservationsForUser(userId);
    const reservations = this.toReservations(reservationsWithErrors);
    const night = nightFromDate(new Date());
    return reservations.pipe(
      map((reservations) =>
        reservations.filter((reservation) =>
          isFurtherAway(reservation.night, night),
        ),
      ),
    );
  }

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
      return this.toReservations(
        this.getReservationsForRefugeAndNight(refugeId, night),
      ).pipe(
        map((reservations) => {
          return { night: night, reservations: reservations };
        }),
      );
    });
    return forkJoin(reservations).pipe(mergeAll());
  }

  getReservation(reservationId: string): Observable<GetReservation> {
    const reservationUri = this.getUriForReservation(reservationId);
    return this.http.get<Reservation>(reservationUri).pipe(
      map((reservation) => fromReservationResponse(reservation)),
      catchError((err: HttpErrorResponse) => of(fromReservationError(err))),
      retry(3),
    );
  }

  getReservationsForRefugeAndUserFromToday(
    refugeId: string,
    userId: string,
  ): Observable<Reservations> {
    return timer(0, 3_000)
      .pipe(
        mergeMap(() => {
          const today = new Date();
          const night = nightFromDate(today);
          return this._getReservationsForRefugeAndUserFrom(
            refugeId,
            userId,
            night,
          );
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .pipe(share());
  }

  private getReservationsForRefugeAndNight(
    refugeId: string,
    night: Night,
  ): Observable<GetReservations> {
    const uri = this.getUriForRefugeAndNight(refugeId, night);
    return this.http.get<Reservations>(uri).pipe(
      map((reservations) => fromReservationsResponse(reservations)),
      catchError((err: HttpErrorResponse) => of(fromReservationsError(err))),
      retry(3),
    );
  }

  private _getReservationsForRefugeAndUserFrom(
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

  private getReservationsForUser(userId: string): Observable<GetReservations> {
    const uri = this.getUriForUser(userId);
    return this.http.get<Reservations>(uri).pipe(
      map((reservations) => fromReservationsResponse(reservations)),
      catchError((err: HttpErrorResponse) => of(fromReservationsError(err))),
      retry(3),
    );
  }

  private toReservations(
    getReservations: Observable<GetReservations>,
  ): Observable<Reservations> {
    return getReservations.pipe(
      map((reservations) => {
        if (isMatching(ErrorGetReservationsPattern, reservations)) return [];
        return (reservations as CorrectGetReservations).reservations;
      }),
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
