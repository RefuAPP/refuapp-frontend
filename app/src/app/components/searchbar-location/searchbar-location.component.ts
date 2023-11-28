import { Component, OnInit } from '@angular/core';
import { Coordinates } from '../../services/search/search.service';
import { first } from 'rxjs';
import { SearchbarCustomEvent } from '@ionic/angular';
import { SearchComponentStore } from './search.store';
import { MapComponentStore } from '../map/map.store';

@Component({
  selector: 'app-searchbar-location',
  templateUrl: './searchbar-location.component.html',
  styleUrls: ['./searchbar-location.component.scss'],
  providers: [SearchComponentStore],
})
export class SearchbarLocationComponent {
  searchCompletion$ = this.componentStore.completions$;
  searchValue$ = this.componentStore.search$;

  constructor(
    private readonly componentStore: SearchComponentStore,
    private readonly mapStore: MapComponentStore,
  ) {}

  moveMapTo(coordinates: Coordinates) {
    this.mapStore.moveMap(coordinates);
    this.componentStore.clearSearch();
  }

  selectFirstSearchResult() {
    this.searchCompletion$.pipe(first()).subscribe((completion) => {
      if (completion.length === 0) return;
      this.moveMapTo(completion[0].coordinate);
    });
  }

  onSearchChange(value: SearchbarCustomEvent) {
    const search = value.detail.value as string;
    this.componentStore.search(search);
  }
}
