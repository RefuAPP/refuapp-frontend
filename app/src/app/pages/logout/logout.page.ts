import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { logOutRequest } from '../../state/auth/auth.actions';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.store.dispatch(logOutRequest());
    this.router.navigate(['/home']).then();
  }

  ngOnInit() {}
}
