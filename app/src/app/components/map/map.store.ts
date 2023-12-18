import { ElementRef, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  combineLatest,
  concatMap,
  EMPTY,
  filter,
  map,
  Observable,
  tap,
} from 'rxjs';
import { Refuge } from '../../schemas/refuge/refuge';
import { MapService } from '../../services/map/map.service';
import { secretEnvironment } from '../../../environments/environment.secret';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { DeviceErrors } from '../../schemas/errors/device';
import {
  customMinorError,
  fatalError,
  minorError,
} from '../../state/errors/error.actions';
import { RefugeService } from '../../services/refuge/refuge.service';
import { ServerErrors } from '../../schemas/errors/server';
import { MapConfiguration } from './map-configuration';
import { Coordinates } from 'src/app/services/search/search.service';

export interface MapState {
  refuges: Refuge[];
  isMapLoaded: boolean;
  hasLibraryLoaded: boolean;
  refugesAddedOnMap: boolean;
  currentRefuge?: Refuge;
  counter: number;
}

@Injectable()
export class MapComponentStore extends ComponentStore<MapState> {
  readonly isMapLoaded$ = this.select((state) => state.isMapLoaded);
  readonly areLibrariesLoaded$ = this.select((state) => state.hasLibraryLoaded);
  readonly watchingRefuge$ = this.select((state) => {
    return {
      refuge: state.currentRefuge,
      counter: state.counter,
    };
  }).pipe(filter((s) => s.refuge !== undefined)) as Observable<{
    refuge: Refuge;
    counter: number;
  }>;

  constructor(
    private readonly mapService: MapService,
    private readonly refugeService: RefugeService,
    private readonly store: Store<AppState>,
  ) {
    super({
      refuges: [],
      isMapLoaded: false,
      hasLibraryLoaded: false,
      refugesAddedOnMap: false,
      counter: 0,
    });
  }

  readonly loadMap = this.effect((obs: Observable<ElementRef>) =>
    obs.pipe(
      concatMap((element) => this.getMapAndRefugesFor(element)),
      tap((refuges) => this.patchState({ refuges })),
      concatMap((refuges) =>
        fromPromise(
          this.mapService.addRefuges(refuges, (refuge) => {
            this.patchState((state) => {
              return {
                counter: state.counter + 1,
                currentRefuge: refuge,
              };
            });
          }),
        ),
      ),
      tapResponse(
        () => {
          this.patchState({ refugesAddedOnMap: true });
        },
        (error) => {
          // TODO check errors messages here, compare it with ServerErrors enum
          this.patchState({ refugesAddedOnMap: false });
          this.store.dispatch(
            minorError({ error: DeviceErrors.NOT_CONNECTED }),
          );
        },
      ),
    ),
  );

  readonly loadLibraries = this.effect(() =>
    this.areLibrariesLoaded$.pipe(
      concatMap((areLibrariesLoaded) => {
        if (areLibrariesLoaded) return EMPTY;
        return this.fetchMapsLibrary();
      }),
      tapResponse(
        () => {
          this.patchState({ hasLibraryLoaded: true });
        },
        (error) => {
          this.patchState({ hasLibraryLoaded: false });
          // TODO: change this, probably breaking ui
          this.store.dispatch(
            fatalError({ error: ServerErrors.UNKNOWN_ERROR }),
          );
        },
      ),
    ),
  );

  readonly moveMap = this.effect((coord: Observable<Coordinates>) =>
    coord.pipe(
      concatMap((coordinates) =>
        fromPromise(this.mapService.move(coordinates)),
      ),
      tapResponse(
        () => {},
        (error) => {
          this.store.dispatch(
            customMinorError({ error: "TODO: Couldn't move to map" }),
          );
        },
      ),
    ),
  );

  readonly destroy = this.effect((obs) =>
    obs.pipe(
      concatMap(() => fromPromise(this.mapService.destroyMap())),
      tapResponse(
        () => {},
        (error) => {},
      ),
    ),
  );

  private fetchMapsLibrary(): Observable<void> {
    return fromPromise(this.loadMapLibrary());
  }

  private async loadMapLibrary() {
    const mapsLibrary = await fetch(
      `https://maps.googleapis.com/maps/api/js?key=${secretEnvironment.mapsKey}&libraries=places&language=ca`,
    );
    const mapsLibraryCode = await mapsLibrary.text();
    eval(mapsLibraryCode);
  }

  private getMapAndRefugesFor(element: ElementRef) {
    return combineLatest([
      this.refugeService.getRefuges(),
      fromPromise(this.mapService.createMap(element, MapConfiguration)),
    ]).pipe(
      map((result) => result[0]),
      map((result) => {
        if (result.status == 'error') throw new Error(result.error);
        return result.data;
      }),
    );
  }
}
