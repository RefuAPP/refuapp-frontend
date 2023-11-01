import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { isMatching, match } from 'ts-pattern';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import {
  UserCredentials,
  UserCredentialsPattern,
} from '../../schemas/user/user';
import { AuthenticationResponse } from '../../schemas/auth/authenticate';
import { Token } from '../../schemas/auth/token';
import {
  AuthenticationErrors,
  ServerErrors,
  UserErrors,
} from '../../schemas/auth/errors';
import {
  CredentialsError,
  parseCredentials,
} from '../../schemas/auth/validate/forms';
import { TranslateService } from '@ngx-translate/core';

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

  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {}

  onLogin(form: NgForm) {
    if (form.invalid) return;
    const credentials = parseCredentials(this.credentials);
    if (isMatching(UserCredentialsPattern, credentials))
      this.login(credentials as UserCredentials);
    else this.handleCredentialsError(credentials as CredentialsError);
  }

  onSignup() {
    this.router.navigate(['/signup']).then();
  }

  private login(credentials: UserCredentials) {
    this.startLoadingAnimation().then(() => {
      this.authService.getToken(credentials).subscribe({
        next: (response: AuthenticationResponse) => {
          this.handleLoginResponse(response);
        },
        error: () => {
          this.handleClientError().then();
        },
      });
    });
  }

  private handleCredentialsError(credentialsError: CredentialsError) {
    match(credentialsError)
      .with(CredentialsError.INCORRECT_PHONE_NUMBER, () =>
        this.showError(
          this.translateService.instant('LOGIN.USERNAME.ERROR_FORMATTED'),
        ),
      )
      .exhaustive();
  }

  private handleLoginResponse(response: AuthenticationResponse) {
    match(response)
      .with({ status: 'authenticated' }, (response) => {
        this.loadingController.dismiss().then(() => {
          const token: Token = response.data;
          this.authService.authenticate(token);
          this.router.navigate(['/']).then();
        });
      })
      .with({ status: 'error' }, (response) => {
        this.handleError(response.error);
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
    await this.finishLoadingAnimationAndExecute(
      async () => await alert.present(),
    );
  }

  private handleError(error: AuthenticationErrors) {
    match(error)
      .with(ServerErrors.UNKNOWN_ERROR, () => {
        this.goToInternalErrorPage().then();
      })
      .with(ServerErrors.INCORRECT_DATA_FORMAT, () => {
        this.goToProgrammingErrorPage().then();
      })
      .with(UserErrors.INCORRECT_PASSWORD, () => {
        this.showErrorAndFinishLoadingAnimation(
          this.translateService.instant(
            'LOGIN.PASSWORD.ERROR_INCORRECT_PASSWORD',
          ),
        ).then();
      })
      .with(UserErrors.USER_NOT_FOUND, () => {
        this.showErrorAndFinishLoadingAnimation(
          this.translateService.instant('LOGIN.USERNAME.ERROR_DOESNT_EXIST'),
        ).then();
      })
      .exhaustive();
  }

  private async goToProgrammingErrorPage() {
    await this.finishLoadingAnimationAndExecute(async () => {
      await this.router.navigate(['programming-error'], {
        skipLocationChange: true,
      });
    });
  }

  private async goToInternalErrorPage() {
    await this.finishLoadingAnimationAndExecute(async () => {
      await this.router.navigate(['internal-error-page'], {
        skipLocationChange: true,
      });
    });
  }

  private async startLoadingAnimation(): Promise<void> {
    const loading = await this.loadingController.create({
      message: this.translateService.instant('LOGIN.LOADING'),
      translucent: true,
    });
    return await loading.present();
  }

  private async finishLoadingAnimationAndExecute(
    func: (() => void) | (() => Promise<void>),
  ) {
    await this.loadingController.dismiss();
    await func();
  }

  private async showErrorAndFinishLoadingAnimation(message: string) {
    await this.finishLoadingAnimationAndExecute(() => this.showError(message));
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.hasError = true;
  }
}
