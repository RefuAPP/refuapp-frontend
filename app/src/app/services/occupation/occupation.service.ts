import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, repeat } from 'rxjs';
import { P } from 'ts-pattern/dist';
import { isMatching, Pattern } from 'ts-pattern';
import { UserCreated } from '../../schemas/user/user';
import { fromError } from '../../schemas/user/create/create-user-response';
import { environment } from '../../../environments/environment';

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
