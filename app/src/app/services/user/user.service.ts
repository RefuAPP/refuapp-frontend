import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, retry } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CreateUser, UserCreated } from '../../schemas/user/user';
import {
  CreateUserResponse,
  fromError,
  fromResponse,
} from '../../schemas/user/create/create-user-response';

const createUserUri = `${environment.API}/users/`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(user: CreateUser): Observable<CreateUserResponse> {
    return this.http.post<UserCreated>(createUserUri, user).pipe(
      map((response: UserCreated) => fromResponse(response)),
      catchError((err: HttpErrorResponse) => of(fromError(err))),
      retry(3),
    );
  }
}
