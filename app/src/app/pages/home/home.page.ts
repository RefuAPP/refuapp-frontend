import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MapService } from '../../services/map/map.service';
import { SearchService } from '../../services/search/search.service';
import { ActivatedRoute } from '@angular/router';
import { MapConfiguration } from './map-configuration';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { destroyMap, loadMap } from '../../state/init/init.actions';
import { AppState } from '../../state/app.state';
import { selectModalState } from '../../state/components/modal/modal.selectors';
import { closeModal } from '../../state/components/modal/modal.actions';

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnDestroy {
  @ViewChild('mapRef', { static: false }) mapRef?: ElementRef;
  search: string = '';
  private readonly refugeId?: string = undefined;
  searchResults: Observable<AutocompletePrediction[]>;
  modalState$ = this.store.select(selectModalState);

  constructor(
    private mapService: MapService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    this.searchResults = this.searchService.getPredictions();
    this.refugeId = this.route.snapshot.paramMap.get('id')?.toString();
  }

  selectSearchResult(item: AutocompletePrediction) {
    this.searchService.toCoordinates(item).then((coordinates) => {
      if (coordinates != null) this.mapService.move(coordinates);
      this.searchService.clear();
    });
  }

  selectFirstSearchResult() {
    this.searchResults.pipe(take(1)).subscribe((predictions) => {
      if (predictions.length > 0) this.selectSearchResult(predictions[0]);
    });
  }

  onSearchChange() {
    this.searchService.sendRequest(this.search);
  }

  ngAfterViewInit() {
    if (this.mapRef) {
      this.store.dispatch(
        loadMap({ map: this.mapRef, config: MapConfiguration }),
      );
    } else {
      console.log('MapRef is undefined');
    }
  }

  dismissedModal() {
    this.store.dispatch(closeModal());
  }

  ngOnDestroy() {
    this.store.dispatch(destroyMap());
  }
}
