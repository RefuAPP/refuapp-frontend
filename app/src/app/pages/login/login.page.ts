import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { map, tap } from 'rxjs';
import { LoginComponentStore } from './login.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { login } from '../../state/auth/auth.actions';
import { ActivatedRoute, Params } from '@angular/router';
import { Maskito, maskitoTransform } from '@maskito/core';
import { UserCredentials } from '../../schemas/user/user';
import { Token } from '../../schemas/auth/token';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [LoginComponentStore],
})
export class LoginPage implements OnInit {
  phoneMask = spainPhoneMask;
  maskPredicate = phoneMaskPredicate;

  form: FormGroup;

  formErrors$ = this.componentStore.error$;
  credentials$ = this.componentStore.form$;
  isLoading$ = this.componentStore.isLoading$;
  token$ = this.componentStore.token$;

  constructor(
    private readonly componentStore: LoginComponentStore,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      phone_number: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.credentials$
      .pipe(
        takeUntilDestroyed(),
        tap((credentials: UserCredentials) => {
          if (credentials) this.form.patchValue(credentials);
        }),
      )
      .subscribe();
    this.route.queryParams
      .pipe(
        takeUntilDestroyed(),
        tap((queryParams: Params) => {
          // TODO: Check if this data is correct
          if (queryParams) {
            const { phone_number, password } = queryParams;
            if (!phone_number || !password) return;
            const user = {
              phone_number: maskitoTransform(phone_number, spainPhoneMask),
              password,
            };
            this.form.patchValue(user);
            this.submit();
          }
        }),
      )
      .subscribe();
    this.token$
      .pipe(
        takeUntilDestroyed(),
        tap((token: Token) => this.store.dispatch(login({ token }))),
      )
      .subscribe();
  }

  ngOnInit() {}

  submit() {
    if (this.form.invalid) return;
    this.componentStore.login(this.form.value);
  }
}
