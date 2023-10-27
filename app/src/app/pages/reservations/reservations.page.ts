import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../../schemas/reservations/reservation';
import { UserReservationService } from '../../services/reservations/user-reservation.service';
import { AuthService } from '../../services/auth/auth.service';
import { RefugeReservationsRelations } from '../../services/reservations/grouped-by/refuge';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  reservations?: Observable<RefugeReservationsRelations>;

  onRemoveReservation(session: Reservation) {
    console.log('Remove reservation', session);
  }

  constructor(
    reservationService: UserReservationService,
    private authService: AuthService,
  ) {
    this.authService.getUserId().then((userId) => {
      if (userId == null) {
        console.log('TODO: handle user not logged in');
        return;
      }
      this.reservations =
        reservationService.getReservationsGroupedByRefugeForUser(userId);
    });
  }

  ngOnInit() {}
}
