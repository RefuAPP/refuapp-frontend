import { Injectable } from '@angular/core';
import {
  catchError,
  filter,
  map,
  Observable,
  ObservableInput,
  of,
  retry,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { isMatching } from 'ts-pattern';
import {
  CorrectGetRefugeResponse,
  GetRefugeResponse,
} from '../../schemas/refuge/get-refuge-schema';
import { isValidId, Refuge, RefugePattern } from '../../schemas/refuge/refuge';
import { GetAllRefugesResponse } from '../../schemas/refuge/get-all-refuges-schema';
import { ServerErrors } from '../../schemas/errors/server';
import { getErrorFrom } from '../../schemas/errors/all-errors';

@Injectable({
  providedIn: 'root',
})
export class RefugeService {
  constructor(private http: HttpClient) {}

  getRefuges(): Observable<GetAllRefugesResponse> {
    return this.getAllRefugesFromApi();
  }

  getRefugeFrom(id: string): Observable<GetRefugeResponse> {
    if (!isValidId(id))
      return of({
        status: 'error',
        error: ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
      });
    return this.getRefugeFromApi(id);
  }

  getRefugeIgnoringErrorsFrom(id: string): Observable<Refuge> {
    return this.getRefugeFrom(id).pipe(
      filter(
        (response): response is CorrectGetRefugeResponse =>
          response.status === 'correct',
      ),
      map((response) => response.data),
    );
  }

  getImageUrlFor(refuge: Refuge): string {
    return `${environment.API}/static/images/refuges/${refuge.image}`;
  }

  private getAllRefugesFromApi(): Observable<GetAllRefugesResponse> {
    const endpoint = this.getAllRefugesEndpoint();
    return this.http.get<Refuge[]>(endpoint).pipe(
      map<Refuge[], GetAllRefugesResponse | Error>((refuges: Refuge[]) => {
        if (isMatching(RefugePattern, refuges.values()))
          return { status: 'correct', data: refuges };
        return {
          status: 'error',
          error: ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
        };
      }),
      catchError<GetAllRefugesResponse | Error, ObservableInput<any>>(
        (err: HttpErrorResponse) =>
          of({
            status: 'error',
            error: getErrorFrom(err),
          }),
      ),
      retry(3),
    );
  }

  private getAllRefugesEndpoint(): string {
    return `${environment.API}/refuges/`;
  }

  private getRefugeFromApi(id: string): Observable<GetRefugeResponse> {
    const endpoint = this.getRefugeFromIdEndpoint(id);
    return this.http.get<Refuge>(endpoint).pipe(
      map<Refuge, GetRefugeResponse | Error>((refuge: Refuge) => {
        if (isMatching(RefugePattern, refuge))
          return { status: 'correct', data: refuge };
        return {
          status: 'error',
          error: ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
        };
      }),
      catchError<GetRefugeResponse | Error, ObservableInput<any>>(
        (err: HttpErrorResponse) =>
          of({
            status: 'error',
            error: getErrorFrom(err),
          }),
      ),
      retry(3),
    );
  }

  private getRefugeFromIdEndpoint(id: string): string {
    return `${environment.API}/refuges/${id}`;
  }
}
