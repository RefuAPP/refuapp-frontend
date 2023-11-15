import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Coordinates } from '../../services/search/search.service';
import { ActivatedRoute } from '@angular/router';
import { MapConfiguration } from './map-configuration';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { selectModalState } from '../../state/components/modal/modal.selectors';
import {
  closeModal,
  openModal,
} from '../../state/components/modal/modal.actions';
import { destroyMap, loadMap, moveMapTo } from '../../state/map/map.actions';
import {
  selectAutoCompletion,
  selectCurrentSearch,
} from '../../state/components/search/search.selectors';
import {
  addSearch,
  clearSearch,
} from '../../state/components/search/search.actions';
import { first, map, takeWhile } from 'rxjs';
import { IonModal, SearchbarCustomEvent } from '@ionic/angular';
import { getRefuges } from '../../state/map/map.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { resourceNotFound } from '../../state/errors/error.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnDestroy {
  @ViewChild('mapRef', { static: false }) mapRef?: ElementRef;
  modalState$ = this.store.select(selectModalState);
  searchCompletion$ = this.store.select(selectAutoCompletion);
  searchValue$ = this.store.select(selectCurrentSearch);
  refuge$ = this.store.select(getRefuges).pipe(
    takeWhile(() => this.route.snapshot.paramMap.get('id') !== null),
    map((refuges) =>
      refuges.find(
        (refuge) => refuge.id === this.route.snapshot.paramMap.get('id'),
      ),
    ),
  );

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    this.refuge$.pipe(takeUntilDestroyed()).subscribe((refuge) => {
      if (refuge === undefined) this.store.dispatch(resourceNotFound());
      else this.store.dispatch(openModal({ refuge }));
    });
  }

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

  changeCurrentModalSize(modal: IonModal) {
    modal.getCurrentBreakpoint().then((breakpoint) => {
      if (breakpoint == 1) modal.setCurrentBreakpoint(0.3).then();
      if (breakpoint == 0.3) modal.setCurrentBreakpoint(1).then();
    });
  }
}
