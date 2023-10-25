import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

export type Group = {
  name: string;
  day: string;
  reservations: Reservation[];
}

export type Reservation = {
  timeStart: string;
  timeEnd: string;
  location: string;
  name: string;
  id: string;
}

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  searchTerm: string = '';
  reservations: Observable<Reservation[]> = new Observable<Reservation[]>();
  private search: Subject<String>

  groups: Group[] = [];
  onReservationClick(session: Reservation) {
    console.log('Reservation clicked', session);
  }

  onRemoveReservation(session: Reservation) {
    console.log('Remove reservation', session);
  }

  searchByName() {
    this.search.next(this.searchTerm);
  }

  constructor(
  ) {
    this.search = new BehaviorSubject<String>("");
    this.groups = [
      {
        name: 'Group 1',
        day: 'Day 1',
        reservations: [
          {
            id: '1',
            name: 'Session 1',
            timeStart: '10:00',
            timeEnd: '11:00',
            location: 'Location 1'
          },
          {
            id: '2',
            name: 'Session 2',
            timeStart: '11:00',
            timeEnd: '12:00',
            location: 'Location 2'
          }
        ]
      },
      {
        name: 'Group 2',
        day: 'Day 2',
        reservations: [
          {
            id: '3',
            name: 'Session 3',
            timeStart: '10:00',
            timeEnd: '11:00',
            location: 'Location 3'
          },
          {
            id: '4',
            name: 'Session 4',
            timeStart: '11:00',
            timeEnd: '12:00',
            location: 'Location 4'
          }
        ]
      }
    ];
  }

  ngOnInit() {
  }

}
