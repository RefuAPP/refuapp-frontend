import { Component, OnInit } from '@angular/core';
import {
  selectAutoCompletion,
  selectCurrentSearch,
} from '../../state/components/search/search.selectors';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { Coordinates } from '../../services/search/search.service';
import {
  addSearch,
  clearSearch,
} from '../../state/components/search/search.actions';
import { first } from 'rxjs';
import { SearchbarCustomEvent } from '@ionic/angular';
import { moveMapTo } from '../../state/map/map.actions';

@Component({
  selector: 'app-searchbar-location',
  templateUrl: './searchbar-location.component.html',
  styleUrls: ['./searchbar-location.component.scss'],
})
export class SearchbarLocationComponent implements OnInit {
  searchCompletion$ = this.store.select(selectAutoCompletion);
  searchValue$ = this.store.select(selectCurrentSearch);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  moveMapTo(coordinates: Coordinates) {
    this.store.dispatch(moveMapTo({ coordinates }));
    this.store.dispatch(clearSearch());
  }

  selectFirstSearchResult() {
    this.searchCompletion$.pipe(first()).subscribe((completion) => {
      if (completion.length === 0) return;
      this.moveMapTo(completion[0].coordinate);
    });
  }

  onSearchChange(value: SearchbarCustomEvent) {
    const search = value.detail.value as string;
    this.store.dispatch(addSearch({ search }));
  }
}
