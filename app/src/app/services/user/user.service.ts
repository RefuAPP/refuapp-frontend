import { Injectable } from '@angular/core';
import { catchError, map, Observable, ObservableInput, of, retry } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  CreateUser,
  isValidId,
  UpdateUser,
  User,
  UserCreated,
  UserPattern,
} from '../../schemas/user/user';
import {
  CreateUserResponse,
  fromError,
  fromResponse,
} from '../../schemas/user/create/create-user-response';
import { GetUserResponse } from '../../schemas/user/fetch/get-refuge-schema';
import { isMatching } from 'ts-pattern';
import { ServerErrors } from '../../schemas/errors/server';
import { getErrorFrom } from '../../schemas/errors/all-errors';
import {
  UpdateUserResponse,
  updateUserResponseFromError,
  updateUserResponseFromResponse,
} from '../../schemas/user/update/update-user-response';
import { UpdateUserError } from '../../schemas/user/update/update-user-error';
import fromHttp = UpdateUserError.fromHttp;

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

  getUserFrom(userId: string): Observable<GetUserResponse> {
    if (!isValidId(userId)) {
      return of({
        status: 'error',
        error: ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
      });
    }
    return this.getUserFromApi(userId);
  }

  private getUserFromApi(userId: string): Observable<GetUserResponse> {
    const endpoint = this.getUserFromIdEndpoint(userId);
    return this.http.get<User>(endpoint).pipe(
      map<User, GetUserResponse | Error>((user: User) => {
        if (isMatching(UserPattern, user))
          return { status: 'correct', data: user };
        return {
          status: 'error',
          error: ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
        };
      }),
      catchError<GetUserResponse | Error, ObservableInput<any>>(
        (err: HttpErrorResponse) =>
          of({
            status: 'error',
            error: getErrorFrom(err),
          }),
      ),
      retry(3),
    );
  }

  private getUserFromIdEndpoint(id: string): string {
    return `${environment.API}/users/${id}`;
  }

  updateUser(user: UpdateUser): Observable<UpdateUserResponse> {
    return this.updateUserFromApi(user);
  }

  private updateUserFromApi(user: UpdateUser): Observable<UpdateUserResponse> {
    const endpoint = this.updateUserEndpoint(user.id);
    return this.http.put<UpdateUserResponse>(endpoint, user).pipe(
      map((response: UpdateUserResponse) =>
        updateUserResponseFromResponse(response),
      ),
      catchError((err: HttpErrorResponse) =>
        of(updateUserResponseFromError(err)),
      ),
      retry(3),
    );
  }

  private updateUserEndpoint(userId: string): string {
    return `${environment.API}/users/${userId}`;
  }
}
