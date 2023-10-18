import {Component, ElementRef, ViewChild} from '@angular/core';
import {GoogleMap} from "@capacitor/google-maps";
import {environment} from "../../../environments/environment.secret";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  map?: GoogleMap;
  @ViewChild('mapRef')set mapRef(ref: ElementRef<HTMLElement>) {
    setTimeout(() => this.createMap(ref.nativeElement), 1000);
  }

  async createMap(ref: HTMLElement) {
    this.map = await GoogleMap.create({
      id: "my-map",
      apiKey: environment.mapsKey,
      element: ref,
      forceCreate: true, // Only required for live update (in  'serve' mode)
      config:  {
        center: {
          lat: 40.7128,
          lng: -74.0060,
        },
        zoom: 10,
      },
    })
  }
}
