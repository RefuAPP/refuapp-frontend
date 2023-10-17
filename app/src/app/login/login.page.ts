import { Component, OnInit } from '@angular/core';
import { LoginRequest } from './schemas/login-request.model';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import MaskitoMasks from '../forms/maskito-masks';
import { formatPhone } from '../forms/format-phone';

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
      this.authService.login(this.login).subscribe(
        async (response) => {
          this.hasError = false;
          await this.authService.saveToken(response);
          await this.loadingController.dismiss();
          this.router.navigate(['/home']).then();
        },
        async (error) => {
          this.hasError = true;
          this.errorMessage = error.error.detail;
          await this.loadingController.dismiss();
        },
      );
    });
  }

  onSignup() {
    this.router.navigate(['/signup']).then();
  }
}
