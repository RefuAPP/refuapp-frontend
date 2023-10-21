import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from '../../../environments/environment.secret';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  autocomplete: google.maps.places.AutocompletionRequest;
  autocompleteItems: google.maps.places.AutocompletePrediction[];
  placeid: string = '';
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  map?: GoogleMap;

  @ViewChild('mapRef') set mapRef(ref: ElementRef<HTMLElement>) {
    setTimeout(() => this.createMap(ref.nativeElement), 1000);
  }

  constructor(private zone: NgZone) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      this.autocomplete,
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          if (predictions) {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          }
        });
      },
    );
  }

  selectSearchResult(item: google.maps.places.AutocompletePrediction) {
    alert(JSON.stringify(item));
    this.placeid = item.place_id;
  }

  clearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }

  async createMap(ref: HTMLElement) {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.mapsKey,
      element: ref,
      forceCreate: true, // Only required for live update (in  'serve' mode)
      config: {
        center: {
          lat: 40.7128,
          lng: -74.006,
        },
        zoom: 10,
      },
    });
  }
}
