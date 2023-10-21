import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MapService } from '../../services/map/map.service';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchService: SearchService;
  @ViewChild('mapRef', { static: false }) mapRef?: ElementRef;

  constructor(
    private zone: NgZone,
    private mapService: MapService,
  ) {
    this.searchService = new SearchService();
  }

  ngAfterViewInit() {
    this.mapService.createMap(this.mapRef);
  }

  selectSearchResult(item: google.maps.places.AutocompletePrediction) {
    alert(JSON.stringify(item));
  }
}
