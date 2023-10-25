import {Component, OnInit} from '@angular/core';
import {Platform} from "@ionic/angular";

export type Group = {
  name: string;
  day: string;
  sessions: Session[];
}

export type Session = {
  tracks: string[];
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

  groups: Group[] = [];

  isMobile() {
    return this.platform.is('mobile');
  }

  isDesktop() {
    return this.platform.is('desktop');
  }

  constructor(
    private platform: Platform,
  ) {
    this.groups = [
      {
        name: 'Group 1',
        day: 'Day 1',
        sessions: [
          {
            id: '1',
            name: 'Session 1',
            tracks: ['Track 1', 'Track 2'],
            timeStart: '10:00',
            timeEnd: '11:00',
            location: 'Location 1'
          },
          {
            id: '2',
            name: 'Session 2',
            tracks: ['Track 1', 'Track 2'],
            timeStart: '11:00',
            timeEnd: '12:00',
            location: 'Location 2'
          }
        ]
      },
      {
        name: 'Group 2',
        day: 'Day 2',
        sessions: [
          {
            id: '3',
            name: 'Session 3',
            tracks: ['Track 1', 'Track 2'],
            timeStart: '10:00',
            timeEnd: '11:00',
            location: 'Location 3'
          },
          {
            id: '4',
            name: 'Session 4',
            tracks: ['Track 1', 'Track 2'],
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
