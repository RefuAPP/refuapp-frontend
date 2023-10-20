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
        next: async (response: AuthenticationResponse) => {
          await this.handleLoginResponse(response);
        },
        error: async () => {
          this.handleClientError().then();
        },
      });
    });
  }

  private handleCredentialsError(credentialsError: CredentialsError) {
    match(credentialsError)
      .with(CredentialsError.INCORRECT_PHONE_NUMBER, () =>
        this.showError('Format del número de telèfon incorrecte'),
      )
      .exhaustive();
  }

  private async handleLoginResponse(response: AuthenticationResponse) {
    match(response)
      .with({ status: 'authenticated' }, async (response) => {
        await this.finishLoadingAnimationAndExecute(async () => {
          const token: Token = response.data;
          await this.authService.authenticate(token);
          this.router.navigate(['/home']).then();
        });
      })
      .with({ status: 'error' }, async (response) => {
        await this.handleError(response.error);
      })
      .exhaustive();
  }

  private async handleClientError() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'El teu dispositiu està fallant',
      message:
        'Funciona la connexió a Internet? Potser és culpa nostra i el nostre servidor està caigut.',
      buttons: [
        {
          text: "Ves a l'inici",
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

  private async handleError(error: AuthenticationErrors) {
    match(error)
      .with(ServerErrors.UNKNOWN_ERROR, async () => {
        await this.goToInternalErrorPage();
      })
      .with(ServerErrors.INCORRECT_DATA_FORMAT, async () => {
        await this.goToProgrammingErrorPage();
      })
      .with(UserErrors.INCORRECT_PASSWORD, async () => {
        await this.showErrorAndFinishLoadingAnimation('Contrasenya incorrecta');
      })
      .with(UserErrors.USER_NOT_FOUND, async () => {
        await this.showErrorAndFinishLoadingAnimation("L'usuari no existeix");
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
      message: 'Iniciant Sessió...',
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
