import {Injectable} from '@angular/core';
import {StorageService} from '../storage/storage.service';
import {LoginRequest} from '../../schemas/login/login-request.model';
import {catchError, map, Observable, ObservableInput, of, retry} from 'rxjs';
import {
    CorrectLoginResponse,
    CorrectLoginResponsePattern,
    LoginErrors,
    LoginResponse,
} from '../../schemas/login/login-response.model';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {SignupRequest} from '../../schemas/signup/signup-request.model';
import {
    CorrectSignupResponse,
    CorrectSignupResponsePattern,
    SignUpErrors, SignUpErrorsExtended,
    SignupResponse,
} from '../../schemas/signup/signup-response.model';
import {SignupForm} from '../../schemas/signup/signup-form.model';
import {isMatching} from 'ts-pattern';

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
      .post<CorrectLoginResponse>(`${environment.API}/login`, formData)
      .pipe(
        map<CorrectLoginResponse, LoginResponse | Error>(
          (response: CorrectLoginResponse) => {
            if (isMatching(CorrectLoginResponsePattern, response))
              return { status: 'correct', data: response };
            return {
              status: 'error',
              error: LoginErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
            };
          },
        ),
        catchError<LoginResponse | Error, ObservableInput<any>>(
          (err: HttpErrorResponse) =>
            of({
              status: 'error',
              error: LoginErrors.from(err),
            }),
        ),
        retry(3),
      );
  }

  signup(user: SignupForm): Observable<SignupResponse> {
    let request: SignupRequest = {
      username: user.username,
      phone_number: user.phone_number,
      emergency_number: user.emergency_number,
      password: user.password,
    };

    return this.http
      .post<CorrectSignupResponse>(`${environment.API}/users`, request)
      .pipe(
        map<CorrectSignupResponse, SignupResponse>(
          (response: CorrectSignupResponse) => {
            if (isMatching(CorrectSignupResponsePattern, response))
              return { status: 'correct', data: response };
            return {
              status: 'error',
              error: SignUpErrors.from(SignUpErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR),
              }
            }),
        catchError<SignupResponse | Error, ObservableInput<any>>(
          (err: HttpErrorResponse) =>
            of({
              status: 'error',
              error: SignUpErrors.fromHttp(err),
            }),
        ),
        retry(3),
      );
  }

  async saveToken(response: CorrectLoginResponse): Promise<void> {
    await this.storageService.set('token', response.access_token);
    this.isLoggedIn = true;
  }
}
