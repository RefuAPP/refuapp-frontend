import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from '../../services/user/user.service';
import { UserForm } from '../../schemas/user/user';
import { phoneMaskPredicate, spainPhoneMask } from '../../schemas/phone/phone';
import { TranslateService } from '@ngx-translate/core';
import {
  getCurrentCredentials,
  getLoginFormErrorMessages,
} from '../../state/auth/auth.selectors';
import { Observable } from 'rxjs';
import { NonUserFormErrors } from '../../schemas/auth/errors';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import {
  getCreateUserDeviceErrors,
  getCreateUserForm,
  getCreateUserFormErrors,
} from '../../state/create-user/create-user.selectors';
import { createUserRequest } from '../../state/create-user/create-user.actions';

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

  formErrors$ = this.store.select(getCreateUserFormErrors);
  deviceErrors$ = this.store.select(getCreateUserDeviceErrors);
  formData$ = this.store.select(getCreateUserForm);

  constructor(private store: Store<AppState>) {}

  signUp() {
    this.store.dispatch(createUserRequest({ credentials: this.form }));
  }
  ngOnInit() {}
}
