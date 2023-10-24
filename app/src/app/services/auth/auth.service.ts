import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { catchError, map, Observable, of, ReplaySubject, retry } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserCredentials } from '../../schemas/user/user';
import {
  AuthenticationResponse,
  fromError,
  fromResponse,
} from '../../schemas/auth/authenticate';
import { Token } from '../../schemas/auth/token';
import jwtDecode from 'jwt-decode';

const authUri = `${environment.API}/login/`;

type JwtPayload = {
  id: string;
  scopes: string[];
  exp: number;
};
const tokenStorageKey = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticatedChannel: ReplaySubject<boolean> =
    new ReplaySubject<boolean>(1);

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
  ) {
    this.isAuthenticatedPromise().then((auth) => {
      this.authenticatedChannel.next(auth);
    });
  }

  getToken(credentials: UserCredentials): Observable<AuthenticationResponse> {
    const data = this.getFormDataFrom(credentials);
    return this.getTokenFromApi(data);
  }

  authenticate(token: Token) {
    this.storageService
      .set(tokenStorageKey, token.access_token)
      .then(() => this.authenticatedChannel.next(true));
  }

  deauthenticate() {
    this.isAuthenticatedPromise().then((auth) => {
      if (auth) {
        this.storageService
          .remove(tokenStorageKey)
          .then(() => this.authenticatedChannel.next(false));
      }
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticatedChannel.asObservable();
  }

  async getUserId(): Promise<string | null> {
    const token = await this.storageService.get(tokenStorageKey);
    if (token === null) return null;
    const payload = jwtDecode<JwtPayload>(token);
    return payload.id;
  }

  private async isAuthenticatedPromise(): Promise<boolean> {
    const token = await this.storageService.get(tokenStorageKey);
    return token != null;
  }

  private getTokenFromApi(data: FormData): Observable<AuthenticationResponse> {
    return this.http.post<Token>(authUri, data).pipe(
      map((response: Token) => fromResponse(response)),
      catchError((err: HttpErrorResponse) => of(fromError(err))),
      retry(3),
    );
  }

  private getFormDataFrom(credentials: UserCredentials): FormData {
    const formData = new FormData();
    formData.append('username', credentials.phone_number);
    formData.append('password', credentials.password);
    formData.append('scope', 'user');
    return formData;
  }
}
