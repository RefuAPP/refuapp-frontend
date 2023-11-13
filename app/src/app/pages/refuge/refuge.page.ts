import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RefugeService } from '../../services/refuge/refuge.service';
import { Refuge } from '../../schemas/refuge/refuge';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.page.html',
  styleUrls: ['./refuge.page.scss'],
})
export class RefugePage implements OnInit, AfterViewInit {
  @Input() refuge?: Refuge;
  modal: HTMLIonModalElement | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private refugeService: RefugeService,
    private alertController: AlertController,
    private modalController: ModalController,
    private translateService: TranslateService,
    private platform: Platform,
  ) {}

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return this.refugeService.getImageUrlFor(this.refuge);
  }

  platformIsMobile(): boolean {
    return this.platform.is('mobile');
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
      return;
    }
    const refugeId = this.getRefugeIdFromUrl();
    // this.fetchRefuge(refugeId);
  }

  private getRefugeIdFromUrl(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  // Fetch Refuge

  // private fetchRefuge(refugeId: string | null) {
  //   if (refugeId != null) this.fetchRefugeFromId(refugeId);
  //   else this.router.navigate(['/']).then();
  // }
  //
  // private fetchRefugeFromId(refugeId: string) {
  //   this.refugeService.getRefugeFrom(refugeId).subscribe({
  //     next: (response: GetRefugeResponse) =>
  //       this.handleGetRefugeResponse(response),
  //     error: () => this.handleClientError().then(),
  //   });
  // }
  //
  // private handleGetRefugeResponse(response: GetRefugeResponse) {
  //   match(response)
  //     .with({ status: 'correct' }, (response) => {
  //       this.refuge = response.data;
  //     })
  //     .with({ status: 'error' }, (response) => {
  //       this.handleError(response.error);
  //     })
  //     .exhaustive();
  // }
  //
  // private handleError(error: GetRefugeFromIdErrors) {
  //   match(error)
  //     .with(GetRefugeFromIdErrors.NOT_FOUND, () => this.handleNotFoundRefuge())
  //     .with(GetRefugeFromIdErrors.CLIENT_SEND_DATA_ERROR, () =>
  //       this.handleBadUserData(),
  //     )
  //     .with(GetRefugeFromIdErrors.UNKNOWN_ERROR, () =>
  //       this.handleUnknownError(),
  //     )
  //     .with(
  //       GetRefugeFromIdErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
  //       GetRefugeFromIdErrors.PROGRAMMER_SEND_DATA_ERROR,
  //       () => this.handleBadProgrammerData(),
  //     )
  //     .exhaustive();
  // }
  //
  // private async handleClientError() {
  //   const alert = await this.alertController.create({
  //     header: this.translateService.instant('HOME.CLIENT_ERROR.HEADER'),
  //     subHeader: this.translateService.instant('HOME.CLIENT_ERROR.SUBHEADER'),
  //     message: this.translateService.instant('HOME.CLIENT_ERROR.MESSAGE'),
  //     buttons: [
  //       {
  //         text: this.translateService.instant('HOME.CLIENT_ERROR.OKAY_BUTTON'),
  //         handler: () => {
  //           this.alertController.dismiss().then();
  //           this.fetchRefuge(this.getRefugeIdFromUrl());
  //         },
  //       },
  //     ],
  //   });
  //   return await alert.present();
  // }
  //
  // private handleNotFoundRefuge() {
  //   this.router
  //     .navigate(['not-found-page'], {
  //       skipLocationChange: true,
  //     })
  //     .then();
  // }
  //
  // private handleBadProgrammerData() {
  //   this.router
  //     .navigate(['programming-error'], {
  //       skipLocationChange: true,
  //     })
  //     .then();
  // }
  //
  // private handleBadUserData() {
  //   this.router
  //     .navigate(['not-found-page'], {
  //       skipLocationChange: true,
  //     })
  //     .then();
  // }
  //
  // private handleUnknownError() {
  //   this.router
  //     .navigate(['internal-error-page'], {
  //       skipLocationChange: true,
  //     })
  //     .then();
  // }
}
