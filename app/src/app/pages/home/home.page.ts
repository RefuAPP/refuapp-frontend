import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MapService } from '../../services/map/map.service';
import { SearchService } from '../../services/search/search.service';
import { RefugeService } from '../../services/refuge/refuge.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetAllRefugesErrors,
  GetAllRefugesResponse,
} from '../../schemas/refuge/get-all-refuges-schema';
import { match } from 'ts-pattern';
import { Refuge } from '../../schemas/refuge/refuge';
import { MapConfiguration } from './map-configuration';
import { Observable, take } from 'rxjs';
import { getModalConfigurationFrom } from './modal-configuration';
import {
  GetRefugeFromIdErrors,
  GetRefugeResponse,
} from '../../schemas/refuge/get-refuge-schema';
import { createChart } from 'lightweight-charts';

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('mapRef', { static: false }) mapRef?: ElementRef;
  search: string = '';
  private readonly refugeId?: string = undefined;
  private isModalOpen: boolean = false;
  searchResults: Observable<AutocompletePrediction[]>;

  constructor(
    private router: Router,
    private mapService: MapService,
    private refugeService: RefugeService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private location: Location,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {
    this.searchResults = this.searchService.getPredictions();
    this.refugeId = this.route.snapshot.paramMap.get('id')?.toString();
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

  ngAfterViewInit() {
    if (this.mapRef) {
      this.mapService
        .createMap(this.mapRef, MapConfiguration)
        .then(() => this.fetchRefuges())
        .then(() => this.showRefugeIfOnUrl());
    } else {
      this.renderMapError();
    }
  }

  ngOnDestroy() {
    this.mapService.onDestroy();
  }

  private showRefugeIfOnUrl() {
    if (this.refugeId) this.showRefuge(this.refugeId);
  }

  private showRefuge(refugeId: string) {
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
        this.handleGetRefugeError(response.error);
      })
      .exhaustive();
  }

  private onRefugeLoaded(refuge: Refuge) {
    this.mapService.move(refuge.coordinates);
    this.onRefugeClick(refuge);
  }

  private handleGetRefugeError(error: GetRefugeFromIdErrors) {
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

  fetchRefuges() {
    return this.refugeService.getRefuges().subscribe({
      next: (response: any) => this.handleGetAllRefugesResponse(response),
      error: () => this.handleClientError().then(),
    });
  }

  private handleGetAllRefugesResponse(response: GetAllRefugesResponse) {
    match(response)
      .with({ status: 'correct' }, (response) => {
        this.addRefugesToMap(response.data);
      })
      .with({ status: 'error' }, (response) => {
        this.handleGetAllRefugesError(response.error);
      })
      .exhaustive();
  }

  private addRefugesToMap(refuges: Refuge[]) {
    this.mapService
      .addRefuges(refuges, (refuge: Refuge) => this.onRefugeClick(refuge))
      .then(() => this.mapService.enableClustering());
  }

  private onRefugeClick(refuge: Refuge) {
    this.location.go(`/home/${refuge.id}`);
    this.modalController
      .create(getModalConfigurationFrom(refuge))
      .then(async (modal) => {
        await modal.present();
      });
  }

  private handleGetAllRefugesError(error: GetAllRefugesErrors) {
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
            this.fetchRefuges();
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
