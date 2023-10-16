import { Injectable } from '@angular/core';
import {
  catchError,
  first,
  map,
  NotFoundError,
  Observable,
  retry,
  throwError,
} from 'rxjs';
import { Refuge } from '../../schemas/refuge';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SearchRefugeError } from './search-refuge-error';

@Injectable({
  providedIn: 'root',
})
export class RefugeService {
  constructor(private http: HttpClient) {}

  getRefugeFrom(id: string): Observable<Refuge> {
    return this.http.get<Refuge>(environment.API + '/refuges/' + id).pipe(
      retry(3),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 0) {
          console.error('A client error occurred:', err.error);
          return throwError(() => SearchRefugeError.CLIENT_ERROR);
        }
        console.error(
          `Backend returned code ${err.status}, body was: `,
          err.error,
        );
        if (err.status == 404) {
          return throwError(() => SearchRefugeError.NOT_FOUND);
        }
        if (err.status == 422) {
          return throwError(() => SearchRefugeError.CLIENT_SEND_DATA_ERROR);
        }
        return throwError(() => SearchRefugeError.UNKNOWN_ERROR);
      }),
    );
  }
}
