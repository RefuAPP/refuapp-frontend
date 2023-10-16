import { Component, OnInit } from '@angular/core';
import { SignupRequest } from './schemas/signup-request.model';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import MaskitoMasks from '../forms/maskito-masks';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { formatPhone } from '../forms/format-phone';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signup: SignupRequest = {
    username: '',
    password: '',
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

    // FIXME: Repeat password not working

    this.signup.phone_number = formatPhone(this.signup.phone_number);
    this.signup.emergency_number = formatPhone(this.signup.emergency_number);

    this.signupLoading().then(() => {
      this.authService.signup(this.signup).subscribe(
        async (response) => {
          this.hasError = false;
          await this.loadingController.dismiss();
          this.router.navigate(['/login']).then();
        },
        async (error) => {
          this.hasError = true;
          this.errorMessage = error.error.message;
          await this.loadingController.dismiss();
        },
      );
    });
  }
}
