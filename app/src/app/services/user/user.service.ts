import { Injectable } from '@angular/core';
import { catchError, map, Observable, ObservableInput, retry } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CreateUser, UserCreated } from '../../schemas/user/user';
import {
  CreateUserResponse,
  parseErrorResponse,
  parseValidResponse,
} from '../../schemas/user/create/create-user-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(user: CreateUser): Observable<CreateUserResponse> {
    return this.http.post<UserCreated>(`${environment.API}/users/`, user).pipe(
      map((response: UserCreated) => parseValidResponse(response)),
      catchError<CreateUserResponse, ObservableInput<any>>(
        (err: HttpErrorResponse) => parseErrorResponse(err),
      ),
      retry(3),
    );
  }
}
