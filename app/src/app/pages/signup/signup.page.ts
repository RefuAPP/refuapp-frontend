import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { isMatching, match } from 'ts-pattern';
import { UserService } from '../../services/user/user.service';
import {
  CreateUser,
  CreateUserPattern,
  UserCreated,
  UserForm,
} from '../../schemas/user/user';
import { CreateUserResponse } from '../../schemas/user/create/create-user-response';
import {
  CreateUserError,
  ServerError,
} from '../../schemas/user/create/create-user-error';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import { parseForm, UserFormError } from '../../schemas/user/validate/form';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  form: UserForm = {
    username: '',
    password: '',
    repeatPassword: '',
    phone_number: '',
    emergency_number: '',
  };
  phoneMask = spainPhoneMask;
  maskPredicate = phoneMaskPredicate;

  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {}

  async signupLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: this.translateService.instant('SIGNUP.LOADING'),
      translucent: true,
    });
    return await loading.present();
  }

  onSignUp(form: NgForm) {
    if (form.invalid) return;
    const request = parseForm(this.form);
    if (isMatching(CreateUserPattern, request))
      this.createUser(request as CreateUser);
    else this.showFormError(request as UserFormError);
  }

  private createUser(request: CreateUser) {
    this.signupLoading().then(() => {
      this.userService.create(request).subscribe({
        next: (response) => {
          this.handleSignupResponse(response);
        },
        error: () => {
          this.handleClientError().then();
        },
      });
    });
  }

  private showFormError(formError: UserFormError) {
    match(formError)
      .with(UserFormError.PASSWORDS_DO_NOT_MATCH, () => {
        this.showErrorMessage(
          this.translateService.instant('SIGNUP.PASSWORDS_DONT_MATCH'),
        ).then();
      })
      .with(UserFormError.INCORRECT_PHONE_NUMBER, () => {
        this.showErrorMessage(
          this.translateService.instant(
            'SIGNUP.PHONE_NUMBER.INCORRECT_PHONE_NUMBER',
          ),
        ).then();
      })
      .with(UserFormError.INCORRECT_EMERGENCY_NUMBER, () => {
        this.showErrorMessage(
          this.translateService.instant(
            'SIGNUP.EMERGENCY_NUMBER.INCORRECT_PHONE_NUMBER',
          ),
        ).then();
      })
      .exhaustive();
  }

  private handleSignupResponse(response: CreateUserResponse) {
    match(response)
      .with({ status: 'created' }, (response) => {
        this.handleCorrectSignup(response.data);
      })
      .with({ status: 'error' }, async (response) => {
        this.handleError(response.error);
      })
      .exhaustive();
  }

  private handleCorrectSignup(data: UserCreated) {
    this.loadingController
      .dismiss()
      .then(() => this.router.navigate(['/login']).then());
  }

  private handleError(error: CreateUserError) {
    match(error)
      .with(ServerError.UNKNOWN_ERROR, () => {
        this.handleUnknownError().then();
      })
      .with(ServerError.INCORRECT_DATA, () => {
        this.handleBadDataFromServer().then();
      })
      .with({ type: 'INVALID_USER_DATA' }, (error) => {
        this.showErrorMessage(error.message).then();
      })
      .with('PHONE_ALREADY_EXISTS', () => {
        this.handleAlreadyExistingPhone().then();
      })
      .exhaustive();
  }

  private async handleClientError() {
    const alert = await this.alertController.create({
      header: this.translateService.instant('HOME.CLIENT_ERROR.HEADER'),
      subHeader: this.translateService.instant('HOME.CLIENT_ERROR.SUBHEADER'),
      message: this.translateService.instant('HOME.CLIENT_ERROR.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('HOME.CLIENT_ERROR.OKAY_BUTTON'),
          handler: () => {
            this.alertController.dismiss().then();
            this.router.navigate(['/home']).then();
          },
        },
      ],
    });
    await this.showError(async () => await alert.present());
  }

  private async handleAlreadyExistingPhone() {
    await this.showErrorMessage(
      this.translateService.instant('SIGNUP.ALREADY_EXISTING_USER'),
    );
  }

  private async handleBadDataFromServer() {
    await this.showError(async () => {
      await this.router.navigate(['programming-error'], {
        skipLocationChange: true,
      });
    });
  }

  private async handleUnknownError() {
    await this.showError(async () => {
      await this.router.navigate(['internal-error-page'], {
        skipLocationChange: true,
      });
    });
  }

  private async showError(func: (() => void) | (() => Promise<void>)) {
    await this.loadingController.dismiss();
    await func();
  }

  private async showErrorMessage(message: string) {
    await this.showError(() => (this.errorMessage = message));
    this.hasError = true;
  }
}
