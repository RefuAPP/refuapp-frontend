import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { match } from 'ts-pattern';
import { ActivatedRoute, Router } from '@angular/router';
import { RefugeService } from '../../services/refuge/refuge.service';
import {
  GetRefugeFromIdErrors,
  GetRefugeResponse,
} from '../../schemas/refuge/get-refuge-schema';
import { Refuge } from '../../schemas/refuge/refuge';
import { createChart } from 'lightweight-charts';
import { getChartConfiguration } from './chart-configuration';
import {
  OccupationService,
  WeeklyOccupation,
} from '../../services/occupation/occupation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.page.html',
  styleUrls: ['./refuge.page.scss'],
})
export class RefugePage implements OnInit, AfterViewInit {
  @Input() refuge?: Refuge;
  @ViewChild('chart', { static: false }) chart?: ElementRef;
  modal: HTMLIonModalElement | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private refugeService: RefugeService,
    private occupationService: OccupationService,
    private alertController: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
    private modalController: ModalController,
    private transateService: TranslateService,
    private platform: Platform,
  ) {}

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return this.refugeService.getImageUrlFor(this.refuge);
  }

  platformIsMobile(): boolean {
    return this.platform.is('mobile');
  }

  onBookClick() {
    alert('En desenvolupament: les reserves estaràn disponibles en breu.');
    console.log(this.platform.platforms());
  }

  clickButton() {
    console.log('click');
  }

  ngOnInit() {}

  openFullModal() {
    if (this.modal == undefined) return;
    this.modal.getCurrentBreakpoint().then((breakpoint) => {
      if (breakpoint == 1) this.modal!.setCurrentBreakpoint(0.3).then();
      if (breakpoint == 0.3) this.modal!.setCurrentBreakpoint(1).then();
    });
  }

  ngAfterViewInit() {
    this.modalController.getTop().then((modal) => {
      this.modal = modal;
    });
    if (this.refuge) {
      this.onRefugeLoaded(this.refuge);
      return;
    }
    const refugeId = this.getRefugeIdFromUrl();
    this.fetchRefuge(refugeId);
  }

  private fetchRefuge(refugeId: string | null) {
    if (refugeId != null) this.fetchRefugeFromId(refugeId);
    else this.router.navigate(['/']).then();
  }

  private getRefugeIdFromUrl(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  private fetchRefugeFromId(refugeId: string) {
    this.refugeService.getRefugeFrom(refugeId).subscribe({
      next: (response: GetRefugeResponse) =>
        this.handleGetRefugeResponse(response),
      error: () => this.handleClientError().then(),
    });
  }

  private handleGetRefugeResponse(response: GetRefugeResponse) {
    match(response)
      .with({ status: 'correct' }, (response) =>
        this.onRefugeLoaded(response.data),
      )
      .with({ status: 'error' }, (response) => {
        this.handleError(response.error);
      })
      .exhaustive();
  }

  private onRefugeLoaded(refuge: Refuge) {
    this.refuge = refuge;
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
    this.occupationService.getWeeklyOccupationMock(refuge.id).subscribe({
      next: (response) => {
        // TODO check for errors here
        const occupation = response as WeeklyOccupation;
        const data = occupation.weekly_data
          .map((dayData) => {
            return {
              time: `${dayData.date.getFullYear()}-${
                dayData.date.getMonth() + 1
              }-${dayData.date.getDate()}`,
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
            }-${time.getDate()}`;
            lineSeries.update({ time: timeString, value: response });
          },
        });
      },
    });
    chart.timeScale().fitContent();
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

  private handleError(error: GetRefugeFromIdErrors) {
    match(error)
      .with(GetRefugeFromIdErrors.NOT_FOUND, () => this.handleNotFoundRefuge())
      .with(GetRefugeFromIdErrors.CLIENT_SEND_DATA_ERROR, () =>
        this.handleBadUserData(),
      )
      .with(GetRefugeFromIdErrors.UNKNOWN_ERROR, () =>
        this.handleUnknownError(),
      )
      .with(
        GetRefugeFromIdErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
        GetRefugeFromIdErrors.PROGRAMMER_SEND_DATA_ERROR,
        () => this.handleBadProgrammerData(),
      )
      .exhaustive();
  }

  private async handleClientError() {
    const alert = await this.alertController.create({
      header: this.transateService.instant('HOME.CLIENT_ERROR.HEADER'),
      subHeader: this.transateService.instant('HOME.CLIENT_ERROR.SUBHEADER'),
      message: this.transateService.instant('HOME.CLIENT_ERROR.MESSAGE'),
      buttons: [
        {
          text: this.transateService.instant('HOME.CLIENT_ERROR.OKAY_BUTTON'),
          handler: () => {
            this.alertController.dismiss().then();
            this.fetchRefuge(this.getRefugeIdFromUrl());
          },
        },
      ],
    });
    return await alert.present();
  }

  private handleNotFoundRefuge() {
    this.router
      .navigate(['not-found-page'], {
        skipLocationChange: true,
      })
      .then();
  }

  private handleBadProgrammerData() {
    this.router
      .navigate(['programming-error'], {
        skipLocationChange: true,
      })
      .then();
  }

  private handleBadUserData() {
    this.router
      .navigate(['not-found-page'], {
        skipLocationChange: true,
      })
      .then();
  }

  private handleUnknownError() {
    this.router
      .navigate(['internal-error-page'], {
        skipLocationChange: true,
      })
      .then();
  }
}
