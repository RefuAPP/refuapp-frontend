import { Component, OnInit } from '@angular/core';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import MaskitoMasks from '../../forms/maskito-masks';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { formatPhone } from '../../forms/format-phone';
import { match } from 'ts-pattern';
import { SignupForm } from '../../schemas/signup/request/signup-form.model';
import {
  SignUpData,
  SignUpResponse,
} from '../../schemas/signup/response/sign-up-response';
import {
  ServerSignupErrors,
  SignUpError,
} from '../../schemas/signup/response/sign-up-error';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  form: SignupForm = {
    username: '',
    password: '',
    repeatPassword: '',
    phone_number: '',
    emergency_number: '',
  };

  phoneMask: MaskitoOptions = MaskitoMasks.phoneMask;
  maskPredicate: MaskitoElementPredicateAsync = MaskitoMasks.maskPredicate;

  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {}

  async signupLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Creant usuari...',
      translucent: true,
    });
    return await loading.present();
  }

  onSignUp(form: NgForm) {
    if (form.invalid) return;
    if (this.form.password !== this.form.repeatPassword) {
      this.hasError = true;
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.form.phone_number = formatPhone(this.form.phone_number);
    this.form.emergency_number = formatPhone(this.form.emergency_number);

    this.signupLoading().then(() => {
      this.authService.signup(this.form).subscribe({
        next: async (response) => {
          await this.handleSignupResponse(response);
        },
        error: async () => {
          this.handleClientError().then();
        },
      });
    });
  }

  private async handleSignupResponse(response: SignUpResponse) {
    match(response)
      .with({ status: 'correct' }, async (response) => {
        await this.handleCorrectSignup(response.data);
      })
      .with({ status: 'error' }, async (response) => {
        await this.handleError(response.error);
      })
      .exhaustive();
  }

  private async handleCorrectSignup(data: SignUpData) {
    console.log(`Correct signup! ${JSON.stringify(data)}`);
    await this.loadingController.dismiss();
    this.router.navigate(['/login']).then();
  }

  private async handleError(error: SignUpError) {
    match(error)
      .with(ServerSignupErrors.UNKNOWN_ERROR, async () => {
        await this.handleUnknownError();
      })
      .with(ServerSignupErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR, async () => {
        await this.handleBadDataFromServer();
      })
      .with({ type: 'invalid-user-data' }, async (error) => {
        this.hasError = true;
        this.errorMessage = error.message;
        await this.loadingController.dismiss();
      })
      .with('PHONE_ALREADY_EXISTS', async (error) => {
        await this.handleAlreadyExistingPhone();
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

  private async handleAlreadyExistingPhone() {
    await this.showErrorMessage(
      'Ja existeix un usuari amb aquest número de telèfon',
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
    this.hasError = true;
    await this.loadingController.dismiss();
    await func();
  }

  private async showErrorMessage(message: string) {
    await this.showError(() => (this.errorMessage = message));
  }
}
