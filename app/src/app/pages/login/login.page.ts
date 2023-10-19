import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../../schemas/login/login-request.model';
import { AuthService } from '../../services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import MaskitoMasks from '../../forms/maskito-masks';
import { formatPhone } from '../../forms/format-phone';
import {
  CorrectLoginResponse,
  LoginErrors,
  LoginErrorsExtended,
  LoginResponse,
} from '../../schemas/login/login-response.model';
import { match } from 'ts-pattern';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login: LoginRequest = {
    username: '',
    password: '',
    scope: 'user',
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

  async loginLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Login in...',
      translucent: true,
    });
    return await loading.present();
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.login.username = formatPhone(this.login.username);

    this.loginLoading().then(() => {
      this.authService.login(this.login).subscribe({
        next: async (response: LoginResponse) => {
          await this.handleLoginResponse(response);
        },
        error: async () => {
          this.handleClientError().then();
        },
      });
    });
  }

  private async handleLoginResponse(response: LoginResponse) {
    match(response)
      .with({ status: 'correct' }, async (response) => {
        let loginResponse: CorrectLoginResponse = response.data;
        await this.authService.saveToken(loginResponse);
        await this.loadingController.dismiss();
        this.router.navigate(['/home']).then();
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

  private async handleError(error: LoginErrorsExtended) {
    match(error)
      .with({ type: '422' }, async (error) => {
        this.hasError = true;
        this.errorMessage = error.message;
        await this.loadingController.dismiss();
      })
      .with({ type: 'other' }, async (error) => {
        await this.handleOtherError(error.error).then();
      })
      .exhaustive();
  }

  private async handleOtherError(error: LoginErrors) {
    match(error)
      .with(LoginErrors.UNAUTHORIZED, async () => {
        await this.handleUnauthorized();
      })
      .with(LoginErrors.NOT_FOUND, async () => {
        await this.handleNotFound();
      })
      .with(LoginErrors.UNKNOWN_ERROR, async () => {
        await this.handleUnknownError();
      })
      .with(LoginErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR, async () => {
        await this.handleBadDataFromServer();
      })
      .exhaustive();
  }

  private async handleUnauthorized() {
    this.hasError = true;
    this.errorMessage = 'Contrasenya incorrecta';
    await this.loadingController.dismiss();
  }

  private async handleNotFound() {
    this.hasError = true;
    this.errorMessage = "L'usuari no existeix";
    await this.loadingController.dismiss();
  }
  private async handleUnknownError() {
    this.hasError = true;
    this.errorMessage = 'Error desconegut';
    await this.loadingController.dismiss();
    this.router.navigate(['/internalerror']).then();
  }

  private async handleBadDataFromServer() {
    this.hasError = true;
    this.errorMessage = 'El servidor ha enviat dades invàlides';
    await this.loadingController.dismiss();
  }

  onSignup() {
    this.router.navigate(['/signup']).then();
  }
}
