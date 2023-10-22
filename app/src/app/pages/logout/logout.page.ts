import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.deauthenticate();
    this.router.navigate(['/home']).then();
  }

  ngOnInit() {}
}
