import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { isMatching } from 'ts-pattern';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import {
  UserCredentials,
  UserCredentialsPattern,
} from '../../schemas/user/user';
import { parseCredentials } from '../../schemas/auth/validate/forms';
import { Store } from '@ngrx/store';
import { loginRequest } from '../../state/auth/auth.actions';
import {
  getErrorName,
  isAuthenticated,
  isTryingAuthentication,
} from '../../state/auth/auth.selectors';
import { AppState } from '../../state/app.state';
import { Observable, takeWhile } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: UserCredentials = {
    phone_number: '',
    password: '',
  };

  phoneMask = spainPhoneMask;
  maskPredicate = phoneMaskPredicate;

  errorMessage$: Observable<string | null> = this.store.select(getErrorName);
  isLoading$: Observable<boolean> = this.store.select(isTryingAuthentication);
  isAuthenticated$: Observable<boolean> = this.store.select(isAuthenticated);

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.isAuthenticated$
      .pipe(takeWhile((isAuthenticated) => !isAuthenticated)) // This is going to prevent us from leaking memory
      .subscribe({
        complete: () => this.router.navigate(['/home']).then(),
      });
  }

  ngOnInit() {}

  onLogin(form: NgForm) {
    if (form.invalid) return;
    const credentials = parseCredentials(this.credentials);
    if (isMatching(UserCredentialsPattern, credentials))
      this.store.dispatch(loginRequest(credentials as UserCredentials));
  }
}
