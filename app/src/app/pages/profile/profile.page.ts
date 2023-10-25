import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};

  constructor(private authService: AuthService, private http: HttpClient) { }

  async ngOnInit() {
    const userId = await this.authService.getUserId();
    if (userId) {
      this.http.get(`${environment.API}/users/${userId}`).subscribe((userData: any) => {
        this.user = userData;
      }, error => {
        console.error("Error obteniendo datos del usuario: ", error);
      });
    }
  }
}
