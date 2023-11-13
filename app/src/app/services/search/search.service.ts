import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

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
  private placesService = new google.maps.places.PlacesService(
    document.createElement('div'),
  );
  private GoogleAutoComplete: AutocompleteService =
    new google.maps.places.AutocompleteService();

  constructor() {}

  getPredictions(request: string): Observable<AutocompletePrediction[]> {
    if (request.length < 3) {
      return of([]);
    }
    return fromPromise(
      this.GoogleAutoComplete.getPlacePredictions({ input: request }),
    ).pipe(map((predictions) => predictions.predictions));
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
