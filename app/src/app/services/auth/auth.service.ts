import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { catchError, map, Observable, of, retry } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserCredentials } from '../../schemas/user/user';
import {
  AuthenticationResponse,
  fromError,
  fromResponse,
} from '../../schemas/auth/authenticate';
import { Token } from '../../schemas/auth/token';
import { jwtDecode } from 'jwt-decode';

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
  constructor(
    private storageService: StorageService,
    private http: HttpClient,
  ) {}

  getToken(credentials: UserCredentials): Observable<AuthenticationResponse> {
    const data = this.getFormDataFrom(credentials);
    return this.getTokenFromApi(data);
  }

  async authenticate(token: Token): Promise<void> {
    await this.storageService.set(tokenStorageKey, token.access_token);
  }

  async deauthenticate() {
    const hasToken = await this.isAuthenticated();
    if (hasToken) await this.storageService.remove(tokenStorageKey);
  }

  async getUserId(): Promise<string | null> {
    const token = await this.storageService.get(tokenStorageKey);
    if (token === null) return null;
    const payload = jwtDecode<JwtPayload>(token);
    return payload.id;
  }

  async isAuthenticated(): Promise<boolean> {
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
