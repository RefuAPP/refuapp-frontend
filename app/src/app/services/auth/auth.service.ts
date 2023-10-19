import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { LoginRequest } from '../../schemas/login/login-request.model';
import { catchError, map, Observable, ObservableInput, of, retry } from 'rxjs';
import {
  CorrectLoginResponse,
  CorrectLoginResponsePattern,
  LoginErrors,
  LoginResponse,
} from '../../schemas/login/login-response.model';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isMatching } from 'ts-pattern';
import {
  parseErrorResponse,
  parseValidResponse,
  SignupResponse,
  ValidUserSignUpResponse,
} from '../../schemas/signup/response/signup-response';
import { SignupRequest } from '../../schemas/signup/request/signup-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: boolean = false;

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
  ) {
    const token = this.storageService.get('token');
    this.isLoggedIn = !!token;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('scope', credentials.scope);

    return this.http
      .post<CorrectLoginResponse>(`${environment.API}/login/`, formData)
      .pipe(
        map<CorrectLoginResponse, LoginResponse | Error>(
          (response: CorrectLoginResponse) => {
            if (isMatching(CorrectLoginResponsePattern, response))
              return { status: 'correct', data: response };
            return {
              status: 'error',
              error: LoginErrors.from(
                LoginErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
              ),
            };
          },
        ),
        catchError<LoginResponse | Error, ObservableInput<any>>(
          (err: HttpErrorResponse) =>
            of({
              status: 'error',
              error: LoginErrors.fromHttp(err),
            }),
        ),
        retry(3),
      );
  }

  logout(): Promise<void> {
    return this.removeToken();
  }

  signup(user: SignupRequest): Observable<SignupResponse> {
    return this.http
      .post<ValidUserSignUpResponse>(`${environment.API}/users/`, user)
      .pipe(
        map((response: ValidUserSignUpResponse) =>
          parseValidResponse(response),
        ),
        catchError<SignupResponse, ObservableInput<any>>(
          (err: HttpErrorResponse) => parseErrorResponse(err),
        ),
        retry(3),
      );
  }

  async saveToken(response: CorrectLoginResponse): Promise<void> {
    await this.storageService.set('token', response.access_token);
    this.isLoggedIn = true;
  }

  async removeToken(): Promise<void> {
    await this.storageService.remove('token');
    this.isLoggedIn = false;
  }
}
