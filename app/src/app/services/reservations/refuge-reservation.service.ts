import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {getNightsFrom, Night, nightFromDate} from '../../schemas/night/night';
import {environment} from '../../../environments/environment';
import {
  catchError,
  forkJoin,
  map,
  mergeAll,
  Observable,
  of,
  retry,
} from 'rxjs';
import {Reservations, ReservationsWeek, WeekReservation} from '../../schemas/reservations/reservation';
import {toReservations, toReservationsWeek} from './common';
import {
  fromError as fromReservationsError,
  fromResponse as fromReservationsResponse,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';

import {
  fromError as fromWeekReservationsError,
  fromResponse as fromWeekReservationsResponse,
  GetWeekReservations,
} from '../../schemas/reservations/get-week-reservations-refuge';

@Injectable({
  providedIn: 'root',
})
export class RefugeReservationService {
  constructor(private http: HttpClient) {
  }

  getWeekReservationsForRefuge(
    refugeId: string,
    offset: number,
  ): Observable<ReservationsWeek> {
    const today = new Date();
    const night = nightFromDate(today)
    return toReservationsWeek(
      this.getWeekReservationsForRefugeAndNight(refugeId, night, offset),
    )
  }

  private getWeekReservationsForRefugeAndNight(
    refugeId: string,
    night: Night,
    offset: number,
  ): Observable<GetWeekReservations> {
    const uri = this.getUriForWeekRefugeAndNight(refugeId, night, offset);
    return this.http.get<ReservationsWeek>(uri).pipe(
      map((reservations) => fromWeekReservationsResponse(reservations)),
      catchError((err: HttpErrorResponse) => of(fromWeekReservationsError(err))),
      retry(3),
    );
  }

  private getUriForWeekRefugeAndNight(refugeId: string, night: Night, offset: number) {
    return `${environment.API}/reservations/refuge/${refugeId}/week/year/${night.year}/month/${night.month}/day/${night.day}/?offset=${offset}`;
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
      return toReservations(
        this.getReservationsForRefugeAndNight(refugeId, night),
      ).pipe(
        map((reservations) => {
          return {night: night, reservations: reservations};
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
