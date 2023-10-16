import { Component, OnInit } from '@angular/core';
import { Refuge } from '../schemas/refuge';
import { ActivatedRoute } from '@angular/router';
import { RefugeService } from '../services/refuge/refuge.service';
import { environment } from '../../environments/environment';
import { SearchRefugeError } from '../services/refuge/search-refuge-error';
import { AlertController } from '@ionic/angular';

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
    else console.error('RefugePage: refugeId is null');
  }

  private fetchRefugeFromId(refugeId: string) {
    this.refugeService.getRefugeFrom(refugeId).subscribe({
      next: (refuge: Refuge) => {
        this.refuge = refuge;
      },
      error: (err: SearchRefugeError) => {
        this.executeErrorHandler(err);
      },
    });
  }

  private executeErrorHandler(err: SearchRefugeError) {
    switch (err) {
      case SearchRefugeError.CLIENT_ERROR:
        this.handleClientError().then();
        break;
      case SearchRefugeError.NOT_FOUND:
        this.handleNotFoundRefuge();
        break;
      case SearchRefugeError.CLIENT_SEND_DATA_ERROR:
        this.handleBadDataRequest();
        break;
      case SearchRefugeError.UNKNOWN_ERROR:
        this.handleUnknownError();
        break;
      default:
        throw new Error('Impossible error');
    }
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

  private handleNotFoundRefuge() {}

  private handleBadDataRequest() {}

  private handleUnknownError() {}

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return environment.API + '/static/images/refuges/' + this.refuge.image;
  }

  clickButton() {
    console.log('click');
  }

  ngOnInit() {}
}
