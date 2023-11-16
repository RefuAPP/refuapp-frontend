import { Component, OnInit } from '@angular/core';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { Coordinates } from '../../services/search/search.service';
import { first } from 'rxjs';
import { SearchbarCustomEvent } from '@ionic/angular';
import { moveMapTo } from '../../state/map/map.actions';
import { SearchComponentStore } from './search.store';

@Component({
  selector: 'app-searchbar-location',
  templateUrl: './searchbar-location.component.html',
  styleUrls: ['./searchbar-location.component.scss'],
  providers: [SearchComponentStore],
})
export class SearchbarLocationComponent implements OnInit {
  searchCompletion$ = this.componentStore.completions$;
  searchValue$ = this.componentStore.search$;

  constructor(
    private readonly componentStore: SearchComponentStore,
    private readonly store: Store<AppState>,
  ) {}

  ngOnInit() {}

  moveMapTo(coordinates: Coordinates) {
    this.store.dispatch(moveMapTo({ coordinates }));
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
