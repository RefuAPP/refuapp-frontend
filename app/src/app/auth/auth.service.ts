import { Injectable } from '@angular/core';
import {StorageService} from "../storage/storage.service";
import {LoginRequest} from "../login/schemas/login-request.model";
import {Observable} from "rxjs";
import {LoginResponse} from "../login/schemas/login-response.model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LoadingController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private loadingController: LoadingController,
  ) {
    const token = this.storageService.get('token');
    this.isLoggedIn = !!token;
  }
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('scope', credentials.scope);

    return this.http.post<LoginResponse>(`${environment.API}/login`, formData)
  }

  async saveToken(response: LoginResponse): Promise<void> {
    await this.storageService.set('token', response.access_token);
    this.isLoggedIn = true;
  }
}
