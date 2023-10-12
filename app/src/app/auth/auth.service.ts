import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {StorageService} from "../storage/storage.service";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {LoginRequest} from "../login/schemas/login-request.model";
import {LoginService} from "../login/login.service";
import {LoginResponse} from "../login/schemas/login-response.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(
    private storageService: StorageService,
    private loginService: LoginService
    ) {
    const token = this.storageService.get('token');
    this._isLoggedIn.next(!!token);
  }

  login(credentials: LoginRequest) {
    return this.loginService.login(credentials).pipe(
      tap((response: LoginResponse) => {
        this._isLoggedIn.next(true);
        this.storageService.set('token', response.access_token);
      })
    );
  }
}
