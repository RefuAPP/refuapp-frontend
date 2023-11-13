import { Component, OnInit } from '@angular/core';
import { UserCreated } from 'src/app/schemas/user/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { changeLanguageRequest } from '../../../state/language/language.actions';
import { getCurrentLanguage } from '../../../state/language/language.selectors';
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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user?: UserCreated;
  hasError = false;
  errorMessage = '';
  avatar: string = '';

  currentLanguage$ = this.store.select(getCurrentLanguage);

  constructor(
    private store: Store<AppState>,
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

  ngOnInit() {}

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
      })
      .with({ status: 'error' }, (response) => {
        this.handleGetError(response.error);
      })
      .exhaustive();
  }

  private handleGetError(error: GetUserFromIdErrors): void {
    match(error)
      .with(GetUserFromIdErrors.UNAUTHORIZED, () =>
        this.handleUnauthorizedError(),
      )
      .with(GetUserFromIdErrors.FORBIDDEN, () => this.handleForbiddenError())
      .with(GetUserFromIdErrors.NOT_FOUND, () => this.handleNotFoundError())
      .with(GetUserFromIdErrors.CLIENT_SEND_DATA_ERROR, () =>
        this.handleBadUserData(),
      )
      .with(GetUserFromIdErrors.UNKNOWN_ERROR, () => this.handleUnknownError())
      .with(
        GetUserFromIdErrors.PROGRAMMER_SEND_DATA_ERROR,
        GetUserFromIdErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
        () => this.handleBadUserData(),
      );
  }

  private async handleUnauthorizedError() {
    await this.showError(async () => {
      await this.showErrorMessage(
        this.translateService.instant('UNAUTHORIZED_ERROR.MESSAGE'),
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

  getRandomAvatar(): string {
    const avatarNumber = this.getRandomPfpNumber();
    return `assets/img/perfil${avatarNumber}.png`;
  }
  private getRandomPfpNumber(): number {
    return Math.floor(Math.random() * 8) + 1;
  }

  async changeLanguage(event: any) {
    const languageCode = (event as CustomEvent).detail.value;
    this.store.dispatch(changeLanguageRequest({ languageCode }));
  }

  updateUser() {
    if (this.user === undefined) return;
    this.router.navigate(['/profile/update', this.user.id]).then();
  }
}
