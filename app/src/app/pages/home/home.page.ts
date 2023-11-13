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
import { closeModal } from '../../state/components/modal/modal.actions';
import { destroyMap, loadMap, moveMapTo } from '../../state/map/map.actions';
import {
  selectAutoCompletion,
  selectCurrentSearch,
} from '../../state/components/search/search.selectors';
import {
  addSearch,
  clearSearch,
} from '../../state/components/search/search.actions';
import { first } from 'rxjs';
import { IonModal, SearchbarCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnDestroy {
  @ViewChild('mapRef', { static: false }) mapRef?: ElementRef;
  private readonly refugeId?: string = undefined;
  modalState$ = this.store.select(selectModalState);
  searchCompletion$ = this.store.select(selectAutoCompletion);
  searchValue$ = this.store.select(selectCurrentSearch);

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    this.refugeId = this.route.snapshot.paramMap.get('id')?.toString();
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
