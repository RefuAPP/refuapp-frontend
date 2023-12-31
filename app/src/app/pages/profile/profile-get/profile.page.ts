import { Component } from '@angular/core';
import {
  UpdateUser,
  UserCreated,
  UserUpdated,
} from 'src/app/schemas/user/user';
import { Router } from '@angular/router';
import {
  GetUserFromIdErrors,
  GetUserResponse,
} from '../../../schemas/user/fetch/get-refuge-schema';
import { match } from 'ts-pattern';
import { UserService } from '../../../services/user/user.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { PermissionsErrors } from '../../../schemas/errors/permissions';
import { ResourceErrors } from '../../../schemas/errors/resource';
import { ServerErrors } from '../../../schemas/errors/server';
import { NgForm } from '@angular/forms';
import {
  format,
  phoneMaskPredicate,
  spainPhoneMask,
} from '../../../schemas/phone/phone';
import { UpdateUserResponse } from '../../../schemas/user/update/update-user-response';
import {
  ServerError,
  ClientError,
  UpdateUserError,
} from '../../../schemas/user/update/update-user-error';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  phoneMask = spainPhoneMask;
  maskPredicate = phoneMaskPredicate;

  user?: UserCreated;
  hasError = false;
  errorMessage = '';
  avatar: string = '';
  isEditing: boolean = false;
  updateUserForm: UpdateUser = {
    id: '',
    username: '',
    phone_number: '',
    emergency_number: '',
    password: '',
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private translateService: TranslateService,
  ) {
    this.getUserId().then((userId: string | null) => this.fetchUser(userId));
    this.avatar = this.getRandomAvatar();
  }

  private async getUserId(): Promise<string | null> {
    return this.authService.getUserId().then();
  }

  private async fetchUser(userId: string | null): Promise<void> {
    if (userId != null) this.fetchUserFromId(userId);
    else this.router.navigate(['/login']).then();
  }

  private fetchUserFromId(userId: string): void {
    this.userService.getUserFrom(userId).subscribe({
      next: (response: GetUserResponse) => this.handleGetUserResponse(response),
      error: () => this.handleClientError().then(),
    });
  }

  private handleGetUserResponse(response: GetUserResponse): void {
    match(response)
      .with({ status: 'correct' }, (response) => {
        this.user = response.data;
        this.updateUserForm = {
          id: this.user.id,
          username: this.user.username,
          phone_number: this.user.phone_number,
          emergency_number: this.user.emergency_number,
          password: '',
        };
      })
      .with({ status: 'error' }, (response) => {
        this.handleGetError(response.error);
      })
      .exhaustive();
  }

  private handleGetError(error: GetUserFromIdErrors): void {
    match(error)
      .with(PermissionsErrors.NOT_AUTHENTICATED, () =>
        this.handleUnauthorizedError(),
      )
      .with(PermissionsErrors.NOT_ALLOWED_OPERATION_FOR_USER, () =>
        this.handleForbiddenError(),
      )
      .with(ResourceErrors.NOT_FOUND, () => this.handleNotFoundError())
      .with(ServerErrors.UNKNOWN_ERROR, () => this.handleUnknownError())
      .with(
        ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
        ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
        () => this.handleBadUserData(),
      )
      .exhaustive();
  }

  private async handleUnauthorizedError() {
    await this.showError(async () => {
      await this.showErrorMessage(
        this.translateService.instant(
          'MINOR_ERRORS.NOT_ALLOWED_OPERATION_FOR_USER',
        ),
      ).then();
    });
  }

  private async handleForbiddenError() {
    await this.showError(async () => {
      await this.router
        .navigate(['/forbidden'], {
          skipLocationChange: true,
        })
        .then();
    });
  }

  private async handleNotFoundError() {
    await this.showError(async () => {
      await this.router
        .navigate(['/not-found-page'], {
          skipLocationChange: true,
        })
        .then();
    });
  }

  private async handleBadUserData() {
    this.showError(() =>
      this.router
        .navigate(['/programming-error'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  private async handleUnknownError() {
    this.showError(() =>
      this.router
        .navigate(['/internal-error-page'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
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
    return await alert.present();
  }

  private async showError(func: (() => void) | (() => Promise<void>)) {
    await this.loadingController.dismiss().then();
    await func();
  }

  private async showErrorMessage(message: string) {
    this.hasError = true;
    await this.showError(() => (this.errorMessage = message));
  }

  getRandomAvatar(): string {
    const avatarNumber = this.getRandomPfpNumber();
    return `assets/img/perfil${avatarNumber}.png`;
  }

  private getRandomPfpNumber(): number {
    return Math.floor(Math.random() * 8) + 1;
  }

  onUpdate(form: NgForm) {
    if (form.invalid) return;
    const formattedPhoneNumber: string | null = format(
      this.updateUserForm.phone_number,
    );
    const formattedEmergencyPhoneNumber: string | null = format(
      this.updateUserForm.emergency_number,
    );
    if (
      formattedPhoneNumber === null ||
      formattedEmergencyPhoneNumber === null
    ) {
      this.hasError = true;
      this.errorMessage = this.translateService.instant(
        'PHONE_FORMAT_INCORRECT',
      );
      return;
    }
    this.updateUserForm.phone_number = formattedPhoneNumber;
    this.updateUserForm.emergency_number = formattedEmergencyPhoneNumber;
    this.userService.updateUser(this.updateUserForm).subscribe({
      next: (response) => this.handleUpdateUserResponse(response),
      error: () => this.handleClientError().then(),
    });
  }

  private handleUpdateUserResponse(response: UpdateUserResponse): void {
    match(response)
      .with({ status: 'updated' }, (response) =>
        this.handleUpdateUserCorrect(response.data),
      )
      .with({ status: 'error' }, (response) =>
        this.handleUpdateUserError(response.error),
      )
      .exhaustive();
  }

  private handleUpdateUserCorrect(user: UserUpdated): void {
    this.user = user;
    this.isEditing = false;
  }

  private handleUpdateUserError(error: UpdateUserError): void {
    match(error)
      .with(ServerError.UNAUTHORIZED, () => this.handleUnauthorizedError())
      .with(ServerError.FORBIDDEN, () => this.handleForbiddenError())
      .with(ServerError.NOT_FOUND, () => this.handleNotFoundError())
      .with(ServerError.CONFLICT, () => this.handleConflictError())
      .with(ServerError.UNKNOWN_ERROR, () => this.handleUnknownError())
      .with(ServerError.INCORRECT_DATA, () => this.handleBadUserData())
      .with({ type: 'INVALID_USER_DATA' }, (err: ClientError) =>
        this.handleInvalidUserData(err.message),
      );
  }

  private async handleConflictError() {
    await this.showError(async () => {
      await this.showErrorMessage(
        this.translateService.instant('PHONE_NUMBER_ALREADY_EXIST'),
      ).then();
    });
  }

  private async handleInvalidUserData(message: string) {
    await this.showError(async () => {
      await this.showErrorMessage(message).then();
    });
  }
}
