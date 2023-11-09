import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import { Store } from '@ngrx/store';
import { loginRequest } from '../../state/auth/auth.actions';
import {
  getCurrentCredentials,
  getLoginFormErrorMessages,
} from '../../state/auth/auth.selectors';
import { AppState } from '../../state/app.state';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  phoneMask = spainPhoneMask;
  maskPredicate = phoneMaskPredicate;

  form: FormGroup;

  formErrors$ = this.store.select(getLoginFormErrorMessages);
  credentials$ = this.store.select(getCurrentCredentials);
  credentialsSubscription?: Subscription;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      phone_number: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.credentialsSubscription = this.credentials$
      .pipe(
        tap((hasCredentials) => {
          if (hasCredentials) {
            this.form.patchValue(hasCredentials);
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.credentialsSubscription?.unsubscribe();
  }

  submit() {
    if (this.form.invalid) return;
    this.store.dispatch(loginRequest({ credentials: this.form.value }));
  }
}
