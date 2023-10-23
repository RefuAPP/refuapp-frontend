import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
import { MapConfiguration } from './map-configuration';
import { Observable, take } from 'rxjs';

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('mapRef', { static: false }) mapRef?: ElementRef;
  search: string = '';
  searchResults: Observable<AutocompletePrediction[]>;

  constructor(
    private router: Router,
    private mapService: MapService,
    private refugeService: RefugeService,
    private searchService: SearchService,
    private alertController: AlertController,
  ) {
    this.searchResults = this.searchService.getPredictions();
  }

  ngAfterViewInit() {
    if (this.mapRef) {
      this.mapService
        .createMap(this.mapRef, MapConfiguration)
        .then(() => this.addRefugesToMap());
    } else {
      this.renderMapError();
    }
  }

  selectSearchResult(item: AutocompletePrediction) {
    this.searchService.toCoordinates(item).then((coordinates) => {
      if (coordinates != null) this.mapService.move(coordinates);
      this.searchService.clear();
    });
  }

  selectFirstSearchResult() {
    this.searchResults.pipe(take(1)).subscribe((predictions) => {
      if (predictions.length > 0) this.selectSearchResult(predictions[0]);
    });
  }

  onSearchChange() {
    this.searchService.sendRequest(this.search);
  }

  addRefugesToMap() {
    return this.refugeService.getRefuges().subscribe({
      next: (response: any) => this.handleGetAllRefugesResponse(response),
      error: () => this.handleClientError().then(),
    });
  }

  private handleGetAllRefugesResponse(response: GetAllRefugesResponse) {
    match(response)
      .with({ status: 'correct' }, (response) => {
        this.mapService
          .addRefuges(response.data, (refuge: Refuge) => {
            console.log(refuge.name);
            alert(refuge.name);
          })
          .then(
              () => this.mapService.enableClustering().then(),
          );
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
            this.addRefugesToMap();
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

  private renderMapError() {
    this.alertController
      .create({
        header: 'Error',
        message:
          'Hi ha hagut un error carregant el mapa, si us plau, torna-ho a intentar.',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.alertController.dismiss().then();
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
