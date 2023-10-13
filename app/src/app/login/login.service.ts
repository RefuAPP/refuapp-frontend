import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginRequest} from "./schemas/login-request.model";
import {LoginResponse} from "./schemas/login-response.model";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Form, NgForm} from "@angular/forms";
import {NgFor} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('scope', credentials.scope);

    const headers = new HttpHeaders();

    return this.http.post('http://127.0.0.1:8000/login', formData, { headers }) as Observable<LoginResponse>;
  }

}
