import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MapService } from '../../services/map/map.service';
import { SearchService } from '../../services/search/search.service';
import { RefugeService } from '../../services/refuge/refuge.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  GetAllRefugesErrors,
  GetAllRefugesResponse,
} from '../../schemas/refuge/get-all-refuges-schema';
import { match } from 'ts-pattern';
import { Refuge } from '../../schemas/refuge/refuge';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('mapRef', { static: false }) mapRef?: ElementRef;
  searchService: SearchService = new SearchService();
  refuges: Refuge[] = [];

  constructor(
    private zone: NgZone,
    private router: Router,
    private mapService: MapService,
    private refugeService: RefugeService,
    private alertController: AlertController,
  ) {}

  ngAfterViewInit() {
    this.mapService.createMap(this.mapRef);
    setTimeout(() => {
      this.getRefuges();
    }, 1000);
  }

  selectSearchResult(item: google.maps.places.AutocompletePrediction) {
    this.searchService.clearSearch();
    this.mapService.moveMapTo(item.place_id);
  }

  selectFirstSearchResult() {
    if (this.searchService.autocompletePredictions.length > 0) {
      this.selectSearchResult(this.searchService.autocompletePredictions[0]);
    }
  }

  getRefuges() {
    return this.refugeService.getRefuges().subscribe({
      next: (response: any) => this.handleGetAllRefugesResponse(response),
      error: () => this.handleClientError().then(),
    });
  }

  private handleGetAllRefugesResponse(response: GetAllRefugesResponse) {
    match(response)
      .with({ status: 'correct' }, (response) => {
        this.refuges = response.data;
        this.mapService.addRefuges(this.refuges, (refuge: Refuge) => {
          console.log(refuge.name);
          alert(refuge.name);
        });
      })
      .with({ status: 'error' }, (response) => {
        this.handleError(response.error);
      })
      .exhaustive();
  }

  private handleError(error: GetAllRefugesErrors) {
    match(error)
      .with(GetAllRefugesErrors.UNKNOWN_ERROR, () => this.handleUnknownError())
      .with(GetAllRefugesErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR, () =>
        this.handleBagProgrammerData(),
      )
      .exhaustive();
  }

  private async handleClientError() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'El client està fallant',
      message:
        'Tens connexió a internet? Potser és culpa nostra i el servidor no està operatiu.',
      buttons: [
        {
          text: "D'acord",
          handler: () => {
            this.alertController.dismiss().then();
            this.getRefuges();
          },
        },
      ],
    });
    return await alert.present();
  }

  private handleUnknownError() {
    this.router
      .navigate(['internal-error-page'], {
        skipLocationChange: true,
      })
      .then();
  }

  private handleBagProgrammerData() {
    this.router
      .navigate(['programming-error'], {
        skipLocationChange: true,
      })
      .then();
  }
}
