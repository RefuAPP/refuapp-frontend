import { Injectable } from '@angular/core';
import { catchError, map, Observable, ObservableInput, of, retry } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Refuge, RefugePattern } from '../../schemas/refuge';
import { GetRefugeFromIdErrors, GetRefugeResponse } from './get-refuge-schema';
import { isMatching } from 'ts-pattern';

@Injectable({
  providedIn: 'root',
})
export class RefugeService {
  constructor(private http: HttpClient) {}

  getRefugeFrom(id: string): Observable<GetRefugeResponse> {
    return this.http.get<Refuge>(environment.API + '/refuges/' + id).pipe(
      map<Refuge, GetRefugeResponse | Error>((refuge: Refuge) => {
        if (isMatching(refuge, RefugePattern))
          return { status: 'correct', data: refuge };
        return {
          status: 'error',
          error: GetRefugeFromIdErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
        };
      }),
      catchError<GetRefugeResponse | Error, ObservableInput<any>>(
        (err: HttpErrorResponse) =>
          of({
            status: 'error',
            error: GetRefugeFromIdErrors.from(err),
          }),
      ),
      retry(3),
    );
  }
}
