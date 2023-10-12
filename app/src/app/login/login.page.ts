import {Component, OnInit} from '@angular/core';
import {LoginRequest} from "./schemas/login-request.model";
import {AuthService} from "../auth/auth.service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

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
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.authService.login(this.login);
    this.router.navigateByUrl('/home').then(r =>
      console.log('navigated to home'));
  }

}
