import { Component, OnDestroy, OnInit } from '@angular/core';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import { Subscription, tap } from 'rxjs';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import {
  getCreateUserForm,
  getCreateUserFormErrors,
} from '../../state/create-user/create-user.selectors';
import { createUserRequest } from '../../state/create-user/create-user.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {
  phoneMask = spainPhoneMask;
  maskPredicate = phoneMaskPredicate;

  form: FormGroup;
  formErrors$ = this.store.select(getCreateUserFormErrors);
  formData$ = this.store.select(getCreateUserForm);
  formDataSubscription?: Subscription;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      phone_number: ['', Validators.required],
      emergency_number: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.valid)
      this.store.dispatch(createUserRequest({ credentials: this.form.value }));
  }

  ngOnInit() {
    this.formDataSubscription = this.formData$
      .pipe(
        tap((formData) => {
          if (formData) this.form.patchValue(formData);
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.formDataSubscription?.unsubscribe();
  }
}
