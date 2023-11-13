import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Refuge } from '../../schemas/refuge/refuge';
import { createChart } from 'lightweight-charts';
import { getChartConfiguration } from '../../pages/refuge/chart-configuration';
import {
  OccupationService,
  WeeklyOccupation,
} from '../../services/occupation/occupation.service';

@Component({
  selector: 'app-reservations-chart',
  templateUrl: './reservations-chart.component.html',
  styleUrls: ['./reservations-chart.component.scss'],
})
export class ReservationsChartComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) refuge!: Refuge;
  @ViewChild('chart', { static: false }) chart?: ElementRef;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private occupationService: OccupationService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createAndStartChart();
  }

  private createAndStartChart() {
    this.changeDetectorRef.detectChanges();
    if (this.chart === undefined) {
      console.log('chart undefined');
      return;
    }
    const chartElement = this.chart.nativeElement;
    const chart = createChart(
      chartElement,
      getChartConfiguration(
        this.getTextColorFromCss(),
        this.getBackgroundColorFromCss(),
      ),
    );
    chart.applyOptions({
      timeScale: {
        fixLeftEdge: true,
        rightBarStaysOnScroll: true,
      },
    });
    // Create chart adjusting the size to the current div size
    const lineSeries = chart.addLineSeries();
    this.occupationService.getWeeklyOccupationMock(this.refuge.id).subscribe({
      next: (response) => {
        // TODO check for errors here
        const occupation = response as WeeklyOccupation;
        const data = occupation.weekly_data
          .map((dayData) => {
            return {
              time: `${dayData.date.getFullYear()}-${
                dayData.date.getMonth() + 1
              }-${this.getFormattedDayDate(dayData.date)}`,
              value: dayData.count,
            };
          })
          .reverse();
        lineSeries.setData(data);
        this.occupationService.getTodayOccupationMock().subscribe({
          next: (response) => {
            const time = new Date();
            const timeString = `${time.getFullYear()}-${
              time.getMonth() + 1
            }-${this.getFormattedDayDate(time)}`;
            lineSeries.update({ time: timeString, value: response });
          },
        });
      },
    });
    chart.timeScale().fitContent();
  }

  private getFormattedDayDate(date: Date): string {
    if (date.getDate() < 10) {
      return `0${date.getDate()}`;
    }
    return `${date.getDate()}`;
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
