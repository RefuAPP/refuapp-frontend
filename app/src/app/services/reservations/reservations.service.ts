import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, retry } from 'rxjs';
import { Reservation } from '../../schemas/reservations/reservation';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  fromError as fromReservationError,
  fromResponse as fromReservationResponse,
  GetReservation,
} from '../../schemas/reservations/get-reservation';
import {
  DeleteReservation,
  fromError as fromDeleteError,
  fromResponse as fromDeleteResponse,
} from '../../schemas/reservations/delete-reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  getReservation(reservationId: string): Observable<GetReservation> {
    const reservationUri = this.getUriForReservation(reservationId);
    return this.http.get<Reservation>(reservationUri).pipe(
      map((reservation) => fromReservationResponse(reservation)),
      catchError((err: HttpErrorResponse) => of(fromReservationError(err))),
      retry(3),
    );
  }

  deleteReservation(reservationId: string): Observable<DeleteReservation> {
    const reservationUri = this.getUriForReservation(reservationId);
    return this.http.delete<Reservation>(reservationUri).pipe(
      map((reservation) => fromDeleteResponse(reservation)),
      catchError((err: HttpErrorResponse) => of(fromDeleteError(err))),
      retry(3),
    );
  }

  private getUriForReservation(reservationId: string) {
    return `${environment.API}/reservations/${reservationId}`;
  }
}
