import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {Refuge} from '../../schemas/refuge/refuge';
import {BarVerticalComponent, Color, ScaleType} from '@swimlane/ngx-charts';
import {OccupationService} from '../../services/occupation/occupation.service';
import {RefugeReservationService} from "../../services/reservations/refuge-reservation.service";
import {WeekReservations} from "../../schemas/reservations/reservation";
import {toShortString} from "../../schemas/night/night";

@Component({
  selector: 'app-reservations-chart',
  templateUrl: './reservations-chart.component.html',
  styleUrls: ['./reservations-chart.component.scss'],
})
export class ReservationsChartComponent implements OnInit {
  @Input({required: true}) refuge!: Refuge;
  @ViewChild('verticalBarChart') verticalBarChart?: BarVerticalComponent;
  chartReservations: WeekReservations = [];
  todayMonth = new Date().getMonth() + 1;
  today = new Date().getDate().toString() + '/' + this.todayMonth.toString() + '/' + new Date().getFullYear().toString();

  formattedChartReservations: {
    name: string;
    value: number;
    tooltipText: string;
  }[] = [];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Linear,
    domain: [],
  };
  xAxisTickFormatting = (value: string) => {
    if (value === this.today) {
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

  getLabels() {
    return this.formattedChartReservations.map((entry) => entry.name);
  }

  private formatChartReservations() {
    this.colorScheme.domain = [];
    this.formattedChartReservations = this.chartReservations.map((entry) => {
      const color = this.today == toShortString(entry.date) ? '#01579b' : '#7aa3e5';
      this.colorScheme.domain.push(color);
      return {
        name: toShortString(entry.date),
        value: entry.count,
        tooltipText: entry.count.toString() + ' reservations',
      };
    });
  }

  ngOnInit() {

    this.reservationService.getWeekReservationsForRefuge(this.refuge.id, 0).subscribe({
      next: (response) => {
        this.chartReservations = response;
        this.formatChartReservations();
        console.log(this.formattedChartReservations)
      },
      error: (err) => {
        console.log("error" + err);
      }
    });
  }
}
