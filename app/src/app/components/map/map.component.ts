import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { destroyMap, loadMap } from '../../state/map/map.actions';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { MapConfiguration } from './map-configuration';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapRef', { static: false }) mapRef?: ElementRef;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.mapRef) {
      this.store.dispatch(
        loadMap({ map: this.mapRef, config: MapConfiguration }),
      );
    } else {
      console.log('TODO: MapRef is undefined');
    }
  }

  ngOnDestroy() {
    this.store.dispatch(destroyMap());
  }
}
