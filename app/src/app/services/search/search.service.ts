import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocompleteRequest: google.maps.places.AutocompletionRequest = { input: '' };
  autocompletePredictions: google.maps.places.AutocompletePrediction[] = [];

  constructor() {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  }

  updateSearchPredictions() {
    this.autocompletePredictions = [];
    this.GoogleAutocomplete.getPlacePredictions(this.autocompleteRequest)
      .then((response) => {
        this.autocompletePredictions = response.predictions;
      })
      .catch((error) => {
        this.autocompletePredictions = [];
      });
  }

  clearSearch() {
    this.autocompleteRequest.input = '';
    this.autocompletePredictions = [];
  }
}
