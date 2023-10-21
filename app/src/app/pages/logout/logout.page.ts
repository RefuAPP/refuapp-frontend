import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { last, lastValueFrom } from 'rxjs';

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
    const auth = authService.isAuthenticated();
    const authSubscription = auth.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.authService.deauthenticate();
        authSubscription.unsubscribe();
        this.router.navigate(['/home']).then();
      } else {
        authSubscription.unsubscribe();
        this.router.navigate(['/home']).then();
      }
    });
  }

  ngOnInit() {}
}
