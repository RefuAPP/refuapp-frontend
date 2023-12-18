import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Refuge } from '../../schemas/refuge/refuge';
import { BarVerticalComponent, Color, ScaleType } from '@swimlane/ngx-charts';
import { OccupationService } from '../../services/occupation/occupation.service';
import { RefugeReservationService } from '../../services/reservations/refuge-reservation.service';
import { WeekReservations } from '../../schemas/reservations/reservation';
import { toShortString } from '../../schemas/night/night';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { GenerateDataCsvResponse } from '../../schemas/data/generate-data-response';
import { match } from 'ts-pattern';
import { GenerateDataError } from '../../schemas/data/generate-data-error';

@Component({
  selector: 'app-reservations-chart',
  templateUrl: './reservations-chart.component.html',
  styleUrls: ['./reservations-chart.component.scss'],
})
export class ReservationsChartComponent implements OnInit {
  @Input({ required: true }) refuge!: Refuge;
  @ViewChild('verticalBarChart') verticalBarChart?: BarVerticalComponent;
  chartReservations: WeekReservations = [];
  todayMonth = new Date().getMonth() + 1;
  today =
    new Date().getDate().toString() +
    '/' +
    this.todayMonth.toString() +
    '/' +
    new Date().getFullYear().toString();

  offset = 0;

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
      return this.translateService.instant('REFUGE.OCCUPATION.TODAY');
    }
    return value;
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private occupationService: OccupationService,
    private reservationService: RefugeReservationService,
    private translateService: TranslateService,
    private alertController: AlertController,
    private router: Router,
    private dataService: DataService,
    private loadingController: LoadingController,
  ) {}

  getLabels() {
    return this.formattedChartReservations.map((entry) => entry.name);
  }

  private formatChartReservations() {
    this.colorScheme.domain = [];
    this.formattedChartReservations = this.chartReservations.map((entry) => {
      const color =
        this.today == toShortString(entry.date) ? '#01579b' : '#7aa3e5';
      this.colorScheme.domain.push(color);
      return {
        name: toShortString(entry.date),
        value: entry.count,
        tooltipText: entry.count.toString() + ' reservations',
      };
    });
  }

  ngOnInit() {
    this.updateChart();
  }

  private updateChart() {
    this.reservationService
      .getWeekReservationsForRefuge(this.refuge.id, this.offset)
      .subscribe({
        next: (response) => {
          this.chartReservations = response;
          this.formatChartReservations();
          console.log(this.formattedChartReservations);
        },
        error: () => this.handleClientError().then(),
      });
  }

  private async handleClientError() {
    const alert = await this.alertController.create({
      header: this.translateService.instant('HOME.CLIENT_ERROR.HEADER'),
      subHeader: this.translateService.instant('HOME.CLIENT_ERROR.SUBHEADER'),
      message: this.translateService.instant('HOME.CLIENT_ERROR.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('HOME.CLIENT_ERROR.OKAY_BUTTON'),
          handler: () => {
            this.alertController.dismiss().then();
            this.router.navigate(['/home']).then();
          },
        },
      ],
    });
    return await alert.present();
  }

  previousWeek() {
    this.offset--;
    this.updateChart();
  }

  nextWeek() {
    this.offset++;
    this.updateChart();
  }

  exportChartData() {
    this.dataService
      .generateCsvForRefuge(this.refuge.id, this.offset)
      .subscribe({
        next: (response: GenerateDataCsvResponse) => {
          this.handleGenerateDataCsvResponse(response);
        },
        error: () => this.handleClientError().then(),
      });
  }

  private handleGenerateDataCsvResponse(response: GenerateDataCsvResponse) {
    match(response)
      .with({ status: 'generated' }, ({ data }) => {
        this.handleGeneratedCsv(data);
      })
      .with({ status: 'error' }, ({ error }) => {
        this.handleGenerateDataError(error);
      })
      .exhaustive();
  }

  private handleGeneratedCsv(data: string) {
    console.log('Generated CSV: ' + data);
    const uri = this.dataService.getUriForCsvDownload(data);
    const link = document.createElement('a');
    link.href = uri;
    link.download = data;
    link.click();
    // TODO: Translate data export string
  }

  private handleGenerateDataError(error: GenerateDataError) {
    match(error)
      .with(GenerateDataError.NOT_FOUND, () => {
        this.handleNotFoundError();
      })
      .with(GenerateDataError.INCORRECT_DATA, () => {
        this.handleBadUserData();
      })
      .with(GenerateDataError.UNKNOWN_ERROR, () => {
        this.handleUnknownError();
      })
      .exhaustive();
  }

  private async handleNotFoundError() {
    await this.showError(async () => {
      await this.router
        .navigate(['/not-found-page'], {
          skipLocationChange: true,
        })
        .then();
    });
  }

  private async handleUnknownError() {
    this.showError(() =>
      this.router
        .navigate(['/internal-error-page'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  private async handleBadUserData() {
    this.showError(() =>
      this.router
        .navigate(['/programming-error'], {
          skipLocationChange: true,
        })
        .then(),
    ).then();
  }

  private async showError(func: (() => void) | (() => Promise<void>)) {
    await this.loadingController.dismiss().then();
    await func();
  }
}
