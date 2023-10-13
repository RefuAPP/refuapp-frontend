import {Component, OnInit} from '@angular/core';
import {LoginRequest} from "./schemas/login-request.model";
import {AuthService} from "../auth/auth.service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";

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
          // TODO: Switch error.status and show messages
          await this.loadingController.dismiss();
        }
      );
    });
  }
}
