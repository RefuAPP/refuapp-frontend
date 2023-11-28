import { Component, OnDestroy, OnInit } from '@angular/core';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import { concatMap, switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateUserComponentStore } from './create-user.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserForm } from '../../schemas/user/user';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  providers: [CreateUserComponentStore],
})
export class SignupPage implements OnDestroy {
  phoneMask = spainPhoneMask;
  maskPredicate = phoneMaskPredicate;

  form: FormGroup;
  isLoading$ = this.componentStore.isLoading$;
  formErrors$ = this.componentStore.error$;
  formData$ = this.componentStore.form$;
  createdUser$ = this.componentStore.createdUser$;

  constructor(
    private readonly componentStore: CreateUserComponentStore,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly loadingCtrl: LoadingController,
    private readonly translateService: TranslateService,
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
    this.isLoading$
      .pipe(
        takeUntilDestroyed(),
        concatMap((isLoading) => {
          if (isLoading) return fromPromise(this.showLoading());
          else return fromPromise(this.stopLoading());
        }),
      )
      .subscribe();
  }

  submit() {
    if (this.form.valid) {
      const userForm = this.form.value as UserForm;
      this.componentStore.createUserRequest(userForm);
    }
  }

  private async stopLoading() {
    const currentElement = await this.loadingCtrl.getTop();
    if (currentElement !== undefined) await this.loadingCtrl.dismiss();
  }

  private async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: this.translateService.instant('SIGNUP.LOADING'),
    });
    await loading.present();
  }

  ngOnDestroy() {
    this.stopLoading().then();
  }
}
