import { Component, OnInit } from '@angular/core';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import { switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateUserComponentStore } from './create-user.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserForm } from '../../schemas/user/user';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers: [CreateUserComponentStore],
})
export class SignupPage implements OnInit {
  phoneMask = spainPhoneMask;
  maskPredicate = phoneMaskPredicate;

  form: FormGroup;
  formErrors$ = this.componentStore.error$;
  formData$ = this.componentStore.form$;
  createdUser$ = this.componentStore.createdUser$;

  constructor(
    private readonly componentStore: CreateUserComponentStore,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      phone_number: ['', Validators.required],
      emergency_number: ['', Validators.required],
    });
    this.formData$
      .pipe(
        takeUntilDestroyed(),
        tap((formData) => {
          if (formData) this.form.patchValue(formData);
        }),
      )
      .subscribe();
    this.createdUser$
      .pipe(
        takeUntilDestroyed(),
        switchMap((user) =>
          this.router.navigate(['/login'], {
            queryParams: {
              phone_number: user.phone_number,
              password: user.password,
            },
            queryParamsHandling: 'merge',
          }),
        ),
      )
      .subscribe();
  }

  submit() {
    if (this.form.valid) {
      const userForm = this.form.value as UserForm;
      this.componentStore.createUserRequest(userForm);
    }
  }

  ngOnInit() {}
}
