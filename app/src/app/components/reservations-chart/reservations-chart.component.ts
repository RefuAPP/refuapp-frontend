import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {Refuge} from '../../schemas/refuge/refuge';
import {BarVerticalComponent, Color, ScaleType} from '@swimlane/ngx-charts';
import {OccupationService} from '../../services/occupation/occupation.service';
import {of} from 'rxjs';
import {RefugeReservationService} from "../../services/reservations/refuge-reservation.service";
import {GetUserResponse} from "../../schemas/user/fetch/get-refuge-schema";
import {WeekReservations} from "../../schemas/reservations/reservation";

@Component({
  selector: 'app-reservations-chart',
  templateUrl: './reservations-chart.component.html',
  styleUrls: ['./reservations-chart.component.scss'],
})
export class ReservationsChartComponent implements OnInit, AfterViewInit {
  @Input({required: true}) refuge!: Refuge;
  @ViewChild('verticalBarChart') verticalBarChart?: BarVerticalComponent;

  chartReservations: WeekReservations = [];
  testDate1 = new Date('2023-10-14');
  testDate2 = new Date('2023-10-15');

  testObservable = of([
    {
      testDate1: 1,
      testDate2: 2,
    },
  ]);

  days: {
    name: string;
    value: number;
    tooltipText: string;
  }[] = [];

  view = [700, 400] as [number, number];

  gradient = false;

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Linear,
    domain: [],
  };
  xAxisTickFormatting = (value: string) => {
    if (value === new Date().getUTCDate().toString()) {
      return 'Today';
    }
    return value;
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private occupationService: OccupationService,
    private reservationService: RefugeReservationService,
  ) {
  }

  onSelect() {
    console.log('myballs');
  }

  getLabels() {
    return this.days.map((entry) => entry.name);
  }

  ngOnInit() {
    // Populate the multi array based on date conditions
    for (let i = -7; i <= 7; i++) {
      const currentDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);

      const color = i === 0 ? '#01579b' : '#7aa3e5'; // Use different colors for the current day and the rest

      this.days.push({
        name: currentDate.getUTCDate().toString(),
        value: Math.floor(Math.random() * 12),
        tooltipText: 'myballs',
      });

      this.colorScheme.domain.push(color);
    }

    this.reservationService.getWeekReservationsForRefuge(this.refuge.id, 0).subscribe({
      next: (response) => {
        this.chartReservations = response;
      },
      error: (err) => {
        console.log("error" + err);
      }
    });
  }

  ngAfterViewInit() {
    this.verticalBarChart!.activeEntries = [
      {
        name: '14',
        value: 5,
      },
    ];
  }

  private getBackgroundColorFromCss(): string {
    const element = document.querySelector('ion-content');
    if (element == null) return 'white';
    const style = window.getComputedStyle(element);
    return style.backgroundColor;
  }

  private getTextColorFromCss(): string {
    const element = document.querySelector('ion-content');
    if (element == null) return 'black';
    const style = window.getComputedStyle(element);
    return style.color;
  }
}
