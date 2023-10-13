import {Component, OnInit} from '@angular/core';
import {LoginRequest} from "./schemas/login-request.model";
import {AuthService} from "../auth/auth.service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginService} from "./login.service";

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
    private authService: LoginService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.authService.login(this.login).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      },
      () => { console.log('Login completed'); }
    );
    // FIXME: Redirect to home
    // this.router.navigateByUrl('/home');
  }
}
