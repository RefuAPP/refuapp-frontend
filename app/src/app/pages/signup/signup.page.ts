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
    const request = parseForm(this.form);
    if (isMatching(CreateUserPattern, request))
      this.createUser(request as CreateUser);
    else this.showFormError(request as UserFormError).then();
  }

  private createUser(request: CreateUser) {
    this.signupLoading().then(() => {
      this.userService.create(request).subscribe({
        next: async (response) => {
          await this.handleSignupResponse(response);
        },
        error: async () => {
          this.handleClientError().then();
        },
      });
    });
  }

  private async showFormError(formError: UserFormError) {
    match(formError)
      .with(UserFormError.PASSWORDS_DO_NOT_MATCH, async () => {
        await this.showErrorMessage('Les contrasenyes no coincideixen');
      })
      .with(UserFormError.INCORRECT_PHONE_NUMBER, async () => {
        await this.showErrorMessage('El número de telèfon és incorrecte');
      })
      .with(UserFormError.INCORRECT_EMERGENCY_NUMBER, async () => {
        await this.showErrorMessage(
          "El número de telèfon d'emergència és incorrecte",
        );
      })
      .exhaustive();
  }

  private async handleSignupResponse(response: CreateUserResponse) {
    match(response)
      .with({ status: 'created' }, async (response) => {
        await this.handleCorrectSignup(response.data);
      })
      .with({ status: 'error' }, async (response) => {
        await this.handleError(response.error);
      })
      .exhaustive();
  }

  private async handleCorrectSignup(data: UserCreated) {
    console.log(`Correct signup! ${JSON.stringify(data)}`);
    await this.loadingController.dismiss();
    this.router.navigate(['/login']).then();
  }

  private async handleError(error: CreateUserError) {
    match(error)
      .with(ServerError.UNKNOWN_ERROR, async () => {
        await this.handleUnknownError();
      })
      .with(ServerError.INCORRECT_DATA, async () => {
        await this.handleBadDataFromServer();
      })
      .with({ type: 'INVALID_USER_DATA' }, async (error) => {
        await this.showErrorMessage(error.message);
      })
      .with('PHONE_ALREADY_EXISTS', async () => {
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
    await this.loadingController.dismiss();
    await func();
  }

  private async showErrorMessage(message: string) {
    await this.showError(() => (this.errorMessage = message));
    this.hasError = true;
  }
}
