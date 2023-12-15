import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Night, nightFromDate } from '../../schemas/night/night';
import { catchError, map, Observable, of, retry } from 'rxjs';
import {
  GenerateDataCsvResponse,
  generateDataCsvResponseFromError,
  generateDataCsvResponseFromResponse,
} from '../../schemas/data/generate-data-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  generateCsvForRefuge(
    refugeId: string,
    offset: number,
  ): Observable<GenerateDataCsvResponse> {
    const today = new Date();
    const night = nightFromDate(today);
    return this.generateCsv(refugeId, night, offset);
  }

  private generateCsv(
    refugeId: string,
    night: Night,
    offset: number,
  ): Observable<GenerateDataCsvResponse> {
    const uri = this.getUriForGenerateCsv(refugeId, night, offset);
    return this.http.get<GenerateDataCsvResponse>(uri).pipe(
      map((reservations) => generateDataCsvResponseFromResponse(reservations)),
      catchError((err: HttpErrorResponse) =>
        of(generateDataCsvResponseFromError(err)),
      ),
      retry(3),
    );
  }
  private getUriForGenerateCsv(
    refugeId: string,
    night: Night,
    offset: number,
  ): string {
    return `${environment.API}/reservations/refuge/${refugeId}/week/year/${night.year}/month/${night.month}/day/${night.day}/data?offset=${offset}`;
  }
}
