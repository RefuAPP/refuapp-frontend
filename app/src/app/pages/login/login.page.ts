import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { match } from 'ts-pattern';
import {
  format,
  phoneMaskPredicate,
  spainPhoneMask,
} from '../../schemas/phone/phone';
import { UserCredentials } from '../../schemas/user/user';
import { AuthenticationResponse } from '../../schemas/auth/authenticate';
import { Token } from '../../schemas/auth/token';
import {
  AuthenticationErrors,
  ServerErrors,
  UserErrors,
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

  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {}

  ngOnInit() {}

  async loginLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Iniciant Sessió...',
      translucent: true,
    });
    return await loading.present();
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    const formattedPhone = format(this.credentials.phone_number);
    if (formattedPhone == null) return;
    this.credentials.phone_number = formattedPhone;

    this.loginLoading().then(() => {
      this.authService.getToken(this.credentials).subscribe({
        next: async (response: AuthenticationResponse) => {
          await this.handleLoginResponse(response);
        },
        error: async () => {
          this.handleClientError().then();
        },
      });
    });
  }

  onSignup() {
    this.router.navigate(['/signup']).then();
  }

  private async handleLoginResponse(response: AuthenticationResponse) {
    match(response)
      .with({ status: 'authenticated' }, async (response) => {
        const token: Token = response.data;
        await this.authService.authenticate(token);
        await this.loadingController.dismiss();
        this.router.navigate(['/home']).then();
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
    await this.showError(async () => await alert.present());
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
        await this.showErrorMessage('Contrasenya incorrecta');
      })
      .with(UserErrors.USER_NOT_FOUND, async () => {
        await this.showErrorMessage("L'usuari no existeix");
      })
      .exhaustive();
  }

  private async goToProgrammingErrorPage() {
    await this.showError(async () => {
      await this.router.navigate(['programming-error'], {
        skipLocationChange: true,
      });
    });
  }

  private async goToInternalErrorPage() {
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
