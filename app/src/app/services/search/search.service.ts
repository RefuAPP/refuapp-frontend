import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

type PlaceResult = google.maps.places.PlaceResult;
type AutocompleteService = google.maps.places.AutocompleteService;
type AutocompletePrediction = google.maps.places.AutocompletePrediction;

export type Coordinates = {
  latitude: number;
  longitude: number;
};

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private predictions = new ReplaySubject<AutocompletePrediction[]>(1);
  private placesService = new google.maps.places.PlacesService(
    document.createElement('div'),
  );
  private GoogleAutoComplete: AutocompleteService =
    new google.maps.places.AutocompleteService();

  constructor() {}

  sendRequest(request: string) {
    if (request.length < 3) {
      this.predictions.next([]);
      return;
    }
    this.GoogleAutoComplete.getPlacePredictions({ input: request })
      .then((response) => {
        this.predictions.next(response.predictions);
      })
      .catch((error) => {
        this.predictions.error(error);
      });
  }

  getPredictions(): Observable<AutocompletePrediction[]> {
    return this.predictions.asObservable();
  }

  async toCoordinates(
    prediction: AutocompletePrediction,
  ): Promise<Coordinates | null> {
    const place = await this.getPlace(prediction.place_id);
    if (!place) return null;
    if (!place.geometry) return null;
    if (!place.geometry?.location) return null;
    return {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };
  }

  clear() {
    this.predictions.next([]);
  }

  private async getPlace(placeId: string): Promise<PlaceResult | null> {
    return new Promise((resolve) => {
      this.placesService.getDetails(
        {
          placeId: placeId,
        },
        (place, status) => {
          resolve(place);
        },
      );
    });
  }
}
