import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Refuge } from '../../schemas/refuge/refuge';
import {
  BarVerticalComponent,
  Color,
  LegendOptions,
  LegendPosition,
  ScaleType,
} from '@swimlane/ngx-charts';
import { OccupationService } from '../../services/occupation/occupation.service';
import { of } from 'rxjs';
import { random } from 'lodash';

@Component({
  selector: 'app-reservations-chart',
  templateUrl: './reservations-chart.component.html',
  styleUrls: ['./reservations-chart.component.scss'],
})
export class ReservationsChartComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) refuge!: Refuge;
  @ViewChild('verticalBarChart') verticalBarChart?: BarVerticalComponent;

  days: { name: string; value: number; tooltipText: string }[] = [];

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

  constructor() {}

  onSelect() {
    console.log('On Select');
  }

  ngOnInit() {
    // Populate the multi array based on date conditions
    for (let i = -7; i <= 7; i++) {
      const currentDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);

      const color = i === 0 ? '#01579b' : '#7aa3e5'; // Use different colors for the current day and the rest

      this.days.push({
        name: currentDate.getUTCDate().toString(),
        value: random(0, 12),
        tooltipText: 'test',
      });

      this.colorScheme.domain.push(color);
    }
  }

  ngAfterViewInit() {
    this.verticalBarChart!.activeEntries = [
      {
        name: '14',
        value: 5,
      },
    ];
  }
}
