import { ElementRef, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps';
import { secretEnvironment } from '../../../environments/environment.secret';
import { environment } from '../../../environments/environment';
import { CameraConfig } from '@capacitor/google-maps/dist/typings/ts_old/definitions';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const mapStyles = [
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
];

const initialCenter = {
  lat: 42.696824,
  lng: 0.453187,
};

const mapConfig = {
  styles: mapStyles,
  disableDefaultUI: true,
  clickableIcons: false,
  mapTypeId: 'hybrid',
  center: initialCenter,
  zoom: 8,
};

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: GoogleMap;
  private placesService = new google.maps.places.PlacesService(
    document.createElement('div'),
  );

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
  ) {}

  moveMapTo(placeId: string) {
    if (!this.map) return;
    this.fetchDetailsFromPlaceId(placeId, (lat, lng) => {
      this.moveMapCameraTo({
        coordinate: {
          lat: lat,
          lng: lng,
        },
        zoom: 15,
        animate: true,
      });
    });
  }

  private moveMapCameraTo(cameraConfig: CameraConfig) {
    this.map!.setCamera(cameraConfig).then();
  }

  private fetchDetailsFromPlaceId(
    placeId: string,
    onDetailsFetched: (lat: number, lng: number) => void,
  ) {
    this.placesService.getDetails(
      {
        placeId: placeId,
      },
      (place, status) => {
        const lat = place?.geometry?.location?.lat();
        const lng = place?.geometry?.location?.lng();
        if (lat && lng) onDetailsFetched(lat, lng);
      },
    );
  }

  createMap(mapRef?: ElementRef) {
    mapRef ? this.createGoogleMap(mapRef) : this.renderError();
  }

  private async createGoogleMap(mapRef: ElementRef) {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: secretEnvironment.mapsKey,
      element: mapRef.nativeElement,
      forceCreate: environment.MAPS_FORCE_CREATE,
      config: mapConfig,
    });
  }

  private renderError() {
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
