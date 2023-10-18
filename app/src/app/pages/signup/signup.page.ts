import { Component, OnInit } from '@angular/core';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import MaskitoMasks from '../../forms/maskito-masks';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { formatPhone } from '../../forms/format-phone';
import { SignupForm } from '../../schemas/signup/signup-form.model';
import {
  CorrectSignupResponse,
  SignUpErrors,
  SignupResponse,
} from '../../schemas/signup/signup-response.model';
import { match } from 'ts-pattern';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signup: SignupForm = {
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
  ) {}

  ngOnInit() {}

  async signupLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Signing up...',
      translucent: true,
    });
    return await loading.present();
  }

  onSignUp(form: NgForm) {
    if (form.invalid) return;
    if (this.signup.password !== this.signup.repeatPassword) {
      this.hasError = true;
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.signup.phone_number = formatPhone(this.signup.phone_number);
    this.signup.emergency_number = formatPhone(this.signup.emergency_number);

    this.signupLoading().then(() => {
      this.authService.signup(this.signup).subscribe({
        next: async (response) => {
          await this.handleSignupResponse(response);
        },
        error: async () => {
          this.handleClientError().then();
        },
      });
    });
  }

  private async handleSignupResponse(response: SignupResponse) {
    match(response)
      .with({ status: 'correct' }, async (response) => {
        let signupResponse: CorrectSignupResponse = response.data;
        await this.loadingController.dismiss();
        this.router.navigate(['/login']).then();
      })
      .with({ status: 'error' }, async (response) => {
        await this.handleError(response.error);
      })
      .exhaustive();
  }

  private async handleClientError() {
    this.hasError = true;
    this.errorMessage =
      'Funciona la connexió a Internet? Potser és culpa nostra i el nostre servidor està caigut.';
    await this.loadingController.dismiss();
    this.router.navigate(['/home']).then();
  }

  private async handleError(error: SignUpErrors) {
    match(error)
      .with(SignUpErrors.UNAUTHORIZED, async () => {
        await this.handleUnauthorized();
      })
      .with(SignUpErrors.CONFLICT, async () => {
        await this.handleConflict();
      })
      .with(SignUpErrors.CLIENT_SEND_DATA_ERROR, async () => {
        await this.handleBadDataRequest();
      })
      .with(SignUpErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR, async () => {
        await this.handleBadDataFromServer();
      })
      .with(SignUpErrors.UNKNOWN_ERROR, async () => {
        await this.handleUnknownError();
      })
      .exhaustive();
  }

  private async handleUnauthorized() {
    this.hasError = true;
    this.errorMessage = 'Rol de token incorrecte';
    await this.loadingController.dismiss();
    this.router.navigate(['/home']).then();
  }

  private async handleConflict() {
    this.hasError = true;
    this.errorMessage = 'Ja existeix un usuari amb aquest número de telèfon';
    await this.loadingController.dismiss();
  }

  private async handleBadDataRequest() {
    this.hasError = true;
    this.errorMessage = 'Dades incorrectes';
    await this.loadingController.dismiss();
  }

  private async handleBadDataFromServer() {
    this.hasError = true;
    this.errorMessage = 'El servidor ha retornat dades incorrectes';
    await this.loadingController.dismiss();
  }

  private async handleUnknownError() {
    this.hasError = true;
    this.errorMessage = 'Error desconegut';
    await this.loadingController.dismiss();
  }
}
