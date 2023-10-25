import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, repeat, share, timer } from 'rxjs';
import { P } from 'ts-pattern/dist';
import { isMatching } from 'ts-pattern';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

export type DayData = {
  date: Date;
  count: number;
};

export type WeeklyOccupation = {
  weekly_data: DayData[];
};

export type DayDataResponse = {
  date: string; // '2023-12-31 23:59:59'
  count: number;
};

export type WeeklyOccupationAPIResponse = {
  weekly_data: DayDataResponse[];
};

export type OccupationError = 'Error';

export type WeeklyOccupationResponse = OccupationError | WeeklyOccupation;

export const WeeklyOccupationResponsePattern: P.Pattern<WeeklyOccupationAPIResponse> =
  {};

@Injectable({
  providedIn: 'root',
})
export class OccupationService {
  constructor(private http: HttpClient) {}

  getWeeklyOccupationMock(
    refugeId: string,
  ): Observable<WeeklyOccupationResponse> {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
    const weeklyOccupations = dates.map((date) => {
      return {
        date: date,
        count: Math.floor(Math.random() * 10),
      };
    });
    return of({
      weekly_data: weeklyOccupations,
    });
  }

  getTodayOccupationMock(): Observable<number> {
    return timer(0, 3_000)
      .pipe(
        map((counter) => {
          return Math.floor(Math.random() * 10);
        }),
      )
      .pipe(share());
  }

  getWeeklyOccupation(refugeId: string): Observable<WeeklyOccupationResponse> {
    const url = this.getSensorsUrlFor(refugeId);
    return this.http.get<WeeklyOccupationAPIResponse>(url).pipe(
      map((response: WeeklyOccupationAPIResponse) => {
        if (isMatching(WeeklyOccupationResponsePattern, response)) {
          const weekly_data = response.weekly_data.map(
            (dayDataResponse: DayDataResponse) => {
              return {
                date: new Date(dayDataResponse.date),
                count: dayDataResponse.count,
              };
            },
          );
          return {
            weekly_data: weekly_data,
          };
        } else {
          return 'Error';
        }
      }),
      catchError<any, any>((err: HttpErrorResponse) => {
        if (err.status === 0) throw new Error('No internet connection');
        else return of('Error');
      }),
      repeat(3),
    );
  }

  private getSensorsUrlFor(refugeId: string) {
    return `${environment.SENSORS_API}/refugio/${refugeId}/weekly_count_by_day/`;
  }
}
