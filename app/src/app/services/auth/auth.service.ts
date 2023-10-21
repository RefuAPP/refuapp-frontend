import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import {
  BehaviorSubject,
  catchError,
  from,
  last,
  lastValueFrom,
  map,
  Observable,
  of,
  retry,
  Subject,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserCredentials } from '../../schemas/user/user';
import {
  AuthenticationResponse,
  fromError,
  fromResponse,
} from '../../schemas/auth/authenticate';
import { Token } from '../../schemas/auth/token';

const authUri = `${environment.API}/login/`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticatedChannel: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

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

  async authenticate(token: Token) {
    await this.storageService.set('token', token.access_token);
    this.authenticatedChannel.next(true);
  }

  async deauthenticate(): Promise<void> {
    if (await this.isAuthenticatedPromise()) {
      await this.storageService.remove('token');
      this.authenticatedChannel.next(false);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticatedChannel;
  }

  private async isAuthenticatedPromise(): Promise<boolean> {
    const token = await this.storageService.get('token');
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
