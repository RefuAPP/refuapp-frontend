import { Injectable } from '@angular/core';
import { catchError, Observable, of, retry } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Refuge } from '../../schemas/refuge';
import { GetRefugeFromIdErrors, GetRefugeResponse } from './get-refuge-schema';

@Injectable({
  providedIn: 'root',
})
export class RefugeService {
  constructor(private http: HttpClient) {}

  getRefugeFrom(id: string): Observable<GetRefugeResponse> {
    return this.http.get<Refuge>(environment.API + '/refuges/' + id).pipe(
      catchError((err: HttpErrorResponse) =>
        of(GetRefugeFromIdErrors.from(err)),
      ),
      retry(3),
    );
  }
}
