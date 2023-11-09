import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { isMatching, match } from 'ts-pattern';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import {
  UserCredentials,
  UserCredentialsPattern,
} from '../../schemas/user/user';
import { parseCredentials } from '../../schemas/auth/validate/forms';
import { Store } from '@ngrx/store';
import { loginRequest } from '../../state/auth/auth.actions';
import {
  getLoginErrors,
  getLoginFormErrorMessages,
  isAuthenticated,
} from '../../state/auth/auth.selectors';
import { AppState } from '../../state/app.state';
import { filter, Observable, OperatorFunction, takeWhile } from 'rxjs';
import { Router } from '@angular/router';
import {
  DeviceErrors,
  NonUserFormErrors,
  ServerErrors,
} from '../../schemas/auth/errors';

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

  formErrors$ = this.store.select(getLoginFormErrorMessages);
  deviceErrors$: Observable<NonUserFormErrors> = this.store
    .select(getLoginErrors)
    .pipe(
      filter((errors) => errors !== null) as OperatorFunction<
        NonUserFormErrors | null,
        NonUserFormErrors
      >,
    );
  isAuthenticated$: Observable<boolean> = this.store.select(isAuthenticated);

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit() {
    const errors = this.deviceErrors$.subscribe((errors) => {
      match(errors)
        .with(DeviceErrors.NOT_CONNECTED, () => {
          console.log('NOT_CONNECTED');
        })
        .with(DeviceErrors.COULDN_T_SAVE_USER_DATA, () => {
          console.log('COULDN"T SAVE DATA INSIDE PHONE');
        })
        .with(ServerErrors.INCORRECT_DATA_FORMAT, () => {
          console.log('SERVER HAS INCORRECT DATA');
        })
        .with(ServerErrors.UNKNOWN_ERROR, () => {
          console.log('UNKNOWN ERROR');
        })
        .exhaustive();
    });
    this.isAuthenticated$
      .pipe(takeWhile((isAuthenticated) => !isAuthenticated))
      .subscribe({
        complete: () => {
          errors.unsubscribe();
          this.router.navigate(['/home']).then();
        },
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;
    const credentials = parseCredentials(this.credentials);
    if (isMatching(UserCredentialsPattern, credentials))
      this.store.dispatch(
        loginRequest({ credentials: credentials as UserCredentials }),
      );
  }
}
