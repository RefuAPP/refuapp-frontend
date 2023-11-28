import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { ServerErrors } from '../../schemas/errors/server';
import { fatalError } from '../../state/errors/error.actions';
import { MapComponentStore } from './map.store';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapRef', { static: false }) mapRef?: ElementRef;

  @Output() clickedRefuge = this.mapStore.watchingRefuge$;
  librariesAreLoaded$ = this.mapStore.areLibrariesLoaded$;

  constructor(
    private store: Store<AppState>,
    private mapStore: MapComponentStore,
  ) {}

  ngAfterViewInit() {
    if (this.mapRef) this.mapStore.loadMap(this.mapRef);
    else this.store.dispatch(fatalError({ error: ServerErrors.UNKNOWN_ERROR }));
  }

  ngOnDestroy() {
    this.mapStore.destroy();
  }
}
