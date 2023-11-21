import { Component, OnInit } from '@angular/core';
import { UpdateUser, UserCreated } from '../../../../schemas/user/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  GetUserFromIdErrors,
  GetUserResponse,
} from '../../../../schemas/user/fetch/get-refuge-schema';
import { match } from 'ts-pattern';
import { PermissionsErrors } from '../../../../schemas/errors/permissions';
import { ResourceErrors } from '../../../../schemas/errors/resource';
import { ServerErrors } from '../../../../schemas/errors/server';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.page.html',
  styleUrls: ['./profile-update.page.scss'],
})
export class ProfileUpdatePage implements OnInit {
  user?: UserCreated;
  form: UpdateUser = {
    id: '',
    username: '',
    phone_number: '',
    emergency_number: '',
    password: '',
  };

  hasError = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private translateService: TranslateService,
  ) {
    const userId = this.getUserIdFromUrl();
    this.fetchUser(userId).then();
  }

  ngOnInit() {}

  private getUserIdFromUrl(): string | null {
    return this.route.snapshot.paramMap.get('id');
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
        this.form = {
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
        ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
        ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
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
        .navigate(['/not-found-page'], {
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
}
