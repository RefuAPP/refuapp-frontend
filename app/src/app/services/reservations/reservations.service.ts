import { Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  concatAll,
  filter,
  flatMap,
  forkJoin,
  from,
  map,
  merge,
  mergeAll,
  mergeMap,
  Observable,
  of,
  pipe,
  retry,
  toArray,
} from 'rxjs';
import {
  Reservation,
  ReservationId,
  ReservationPattern,
  Reservations,
  ReservationsPattern,
} from '../../schemas/reservations/reservation';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isMatching } from 'ts-pattern';
import {
  CorrectGetReservation,
  fromError as fromReservationError,
  fromResponse as fromReservationResponse,
  GetReservation,
  GetReservationError,
} from '../../schemas/reservations/get-reservation';
import {
  CorrectRefugeAndUserReservation,
  CorrectRefugeAndUserReservationPattern,
  fromError as fromRefugeAndUserError,
  fromResponse as fromRefugeAndUserResponse,
  GetReservations,
  GetReservationsRefugeAndUser,
  ReservationRefugeAndUserError,
} from '../../schemas/reservations/get-reservations-refuge-user';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  _getReservationsForUser(userId: string): Observable<Reservations> {
    return of([]);
  }

  _getReservationsForRefuge(refugeId: string): Observable<Reservations> {
    return of([]);
  }

  getReservationsForRefugeAndUser(
    refugeId: string,
    userId: string,
  ): Observable<Reservation[]> {
    const reservationsId: Observable<string[]> =
      this._getReservationsForRefugeAndUser(refugeId, userId).pipe(
        filter((reservations) => reservations.status === 'ok'),
        map(
          (reservations) =>
            (reservations as CorrectRefugeAndUserReservation).reservations,
        ),
      );
    return reservationsId.pipe(
      mergeMap((ids) =>
        from(ids).pipe(mergeMap((id) => this.getReservation(id))),
      ),
      filter((reservation) => reservation.status === 'ok'),
      map((reservation) => (reservation as CorrectGetReservation).reservation),
      toArray(),
    );
  }

  getReservation(reservationId: ReservationId): Observable<GetReservation> {
    const reservationUri = this.getUriForReservation(reservationId);
    return this.http.get<Reservation>(reservationUri).pipe(
      map((reservation) => fromReservationResponse(reservation)),
      catchError((err: HttpErrorResponse) => of(fromReservationError(err))),
      retry(3),
    );
  }

  private _getReservationsForRefugeAndUser(
    refugeId: string,
    userId: string,
  ): Observable<GetReservationsRefugeAndUser> {
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

  private getUriForReservation(reservationId: ReservationId) {
    return `${environment.API}/reservations/${reservationId}`;
  }
}
