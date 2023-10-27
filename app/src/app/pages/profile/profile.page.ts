import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserCreated } from 'src/app/schemas/user/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user?: UserCreated;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.authService.getUserId().then((userId: string | null) => {
      if (userId === null)
        throw new Error('No se ha encontrado el id del usuario');
      this.http
        .get<UserCreated>(`${environment.API}/users/${userId}`)
        .subscribe({
          next: (userData: UserCreated) => {
            this.user = userData;
          },
          error: (error: any) => {
            console.error('Error obteniendo datos del usuario: ', error);
          },
        });
    });
  }
}
