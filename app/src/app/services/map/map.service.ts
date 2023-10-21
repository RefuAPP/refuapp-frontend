import { ElementRef, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps';
import { secretEnvironment } from '../../../environments/environment.secret';
import { environment } from '../../../environments/environment';

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

  constructor(private alertController: AlertController) {}

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
            text: 'Reintentar',
            handler: () => {
              window.location.reload();
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
