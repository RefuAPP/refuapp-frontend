import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {match} from 'ts-pattern';
import {ActivatedRoute, Router} from '@angular/router';
import {RefugeService} from '../../services/refuge/refuge.service';
import {
  GetRefugeFromIdErrors,
  GetRefugeResponse,
} from '../../schemas/refuge/get-refuge-schema';
import {Refuge} from '../../schemas/refuge/refuge';
import {createChart} from 'lightweight-charts';

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.page.html',
  styleUrls: ['./refuge.page.scss'],
})
export class RefugePage implements OnInit, AfterViewInit {
  @Input() refuge?: Refuge;
  @ViewChild('chart', {static: false}) chart?: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private refugeService: RefugeService,
    private alertController: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    if (this.refuge == undefined) {
      const refugeId = this.getRefugeIdFromUrl();
      this.fetchRefuge(refugeId);
    }
  }

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return this.refugeService.getImageUrlFor(this.refuge);
  }

  clickButton() {
    console.log('click');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
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
      .with({status: 'correct'}, (response) =>
        this.onRefugeLoaded(response.data),
      )
      .with({status: 'error'}, (response) => {
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
    const chart = createChart(chartElement, {
      width: 3000,
      height: 300,
    });
    // Create chart adjusting the size to the current div size
    const lineSeries = chart.addLineSeries();
    lineSeries.setData([
      {time: '2019-04-11', value: 80.01},
      {time: '2019-04-12', value: 96.63},
      {time: '2019-04-13', value: 76.64},
      {time: '2019-04-14', value: 81.89},
      {time: '2019-04-15', value: 74.43},
      {time: '2019-04-16', value: 80.01},
      {time: '2019-04-17', value: 96.63},
      {time: '2019-04-18', value: 76.64},
      {time: '2019-04-19', value: 81.89},
      {time: '2019-04-20', value: 74.43},
    ]);
    chart.timeScale().fitContent();
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
      header: 'Alert',
      subHeader: 'The client is failing',
      message:
        'Is your internet connection working? Maybe is our fault and our server is down.',
      buttons: [
        {
          text: 'OK',
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
