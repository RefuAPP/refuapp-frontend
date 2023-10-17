import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { match } from 'ts-pattern';
import {Refuge, RefugePattern} from "../../schemas/refuge";
import {ActivatedRoute} from "@angular/router";
import {RefugeService} from "../../services/refuge/refuge.service";
import {environment} from "../../../environments/environment";
import {GetRefugeFromIdErrors, GetRefugeResponse} from "../../services/refuge/get-refuge-schema";

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.page.html',
  styleUrls: ['./refuge.page.scss'],
})
export class RefugePage implements OnInit {
  refuge: Refuge | undefined;

  constructor(
    private route: ActivatedRoute,
    private refugeService: RefugeService,
    private alertController: AlertController,
  ) {
    const refugeId = this.route.snapshot.paramMap.get('id');
    if (refugeId != null) this.fetchRefugeFromId(refugeId);
    else console.error('TODO: handle refugeId not included in the route');
  }

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return environment.API + '/static/images/refuges/' + this.refuge.image;
  }

  clickButton() {
    console.log('click');
  }

  ngOnInit() {}

  private fetchRefugeFromId(refugeId: string) {
    this.refugeService.getRefugeFrom(refugeId).subscribe({
      next: (response: GetRefugeResponse) =>
        this.handleGetRefugeResponse(response),
      error: () => this.handleClientError().then(),
    });
  }

  private handleGetRefugeResponse(response: GetRefugeResponse) {
    match(response)
      .with(RefugePattern, (refuge: Refuge) => (this.refuge = refuge))
      .with(GetRefugeFromIdErrors.NOT_FOUND, () => this.handleNotFoundRefuge())
      .with(GetRefugeFromIdErrors.CLIENT_SEND_DATA_ERROR, () =>
        this.handleBadDataRequest(),
      )
      .with(GetRefugeFromIdErrors.UNKNOWN_ERROR, () =>
        this.handleUnknownError(),
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
            console.log('TODO: go to home page');
          },
        },
      ],
    });
    return await alert.present();
  }

  private handleNotFoundRefuge() {
    console.log('TODO: handleNotFoundRefuge');
  }

  private handleBadDataRequest() {
    console.log('TODO: handleBadDataRequest');
  }

  private handleUnknownError() {
    console.log('TODO: handleUnknownError');
  }
}
