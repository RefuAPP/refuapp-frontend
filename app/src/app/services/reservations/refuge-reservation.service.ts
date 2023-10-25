import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { getNightsFrom, Night } from '../../schemas/night/night';
import { environment } from '../../../environments/environment';
import {
  catchError,
  forkJoin,
  map,
  mergeAll,
  Observable,
  of,
  retry,
} from 'rxjs';
import { Reservations } from '../../schemas/reservations/reservation';
import { toReservations } from './common';
import {
  fromError as fromReservationsError,
  fromResponse as fromReservationsResponse,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';

@Injectable({
  providedIn: 'root',
})
export class RefugeReservationService {
  constructor(private http: HttpClient) {}

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
      return toReservations(
        this.getReservationsForRefugeAndNight(refugeId, night),
      ).pipe(
        map((reservations) => {
          return { night: night, reservations: reservations };
        }),
      );
    });
    return forkJoin(reservations).pipe(mergeAll());
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

  private getUriForRefugeAndNight(refugeId: string, night: Night) {
    return `${environment.API}/reservations/refuge/${refugeId}/year/${night.year}/month/${night.month}/day/${night.day}}`;
  }
}
