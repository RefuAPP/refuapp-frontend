import {Component, OnInit} from '@angular/core';
import {LoginRequest} from "./schemas/login-request.model";
import {AuthService} from "../auth/auth.service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";
import {MaskitoElementPredicateAsync, MaskitoOptions} from "@maskito/core";

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
  }

  readonly phoneMask: MaskitoOptions = {
    mask: ['(', '+', '3', '4', ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
  ) {
  }

  ngOnInit() {
  }

  async loginLoading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Login in...',
      translucent: true,
    });
    return await loading.present();
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.loginLoading().then(r => {
      this.authService.login(this.login).subscribe(
        async (response) => {
          await this.authService.saveToken(response);
          await this.loadingController.dismiss();
          // FIXME: this.router.navigate(['/home']);
        },
        async (error) => {
          console.log(error);
          switch (error.status) {
            case 401:
              console.log("401 error");
              console.log(error.error);
              break;
            case 404:
              this.hasError = true;
              this.errorMessage = error.error.detail;
              console.log("404 error");
              console.log(error.error);
              console.log(this.errorMessage);
              console.log(this.hasError)
              break;
            case 422:
              console.log("422 error");
              console.log(error.error);
              break;
            default:
              console.log("default error");
          }
          // TODO: Switch error.status and show messages
          await this.loadingController.dismiss();
        }
      );
    });
  }
}
