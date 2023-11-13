import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import {
  destroyMap,
  loadedMap,
  loadedMapLibrary,
  loadedRefuges,
  loadedRefugesOnMap,
  loadMap,
  loadMapLibrary,
  loadRefuges,
  loadRefugesError,
} from './init.actions';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { secretEnvironment } from '../../../environments/environment.secret';
import { MapService } from '../../services/map/map.service';
import { RefugeService } from '../../services/refuge/refuge.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { setRefuge } from '../refuge/refuge.actions';
import { cloneDeep } from 'lodash';
import { setOpen } from '../modal/modal.actions';

@Injectable()
export class InitEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private mapService$: MapService,
    private refugeService: RefugeService,
  ) {}

  loadEverything$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap((createData) => [loadMapLibrary(), loadRefuges()]),
    ),
  );

  loadGoogleMapsLibrary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMapLibrary),
      // TODO: Search for errors here
      switchMap((createData) =>
        fromPromise(this.fetchGoogleMapsLibrary()).pipe(
          map(() => loadedMapLibrary()),
        ),
      ),
    ),
  );

  destroyMap$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(destroyMap),
        tap(() => this.mapService$.destroyMap()),
      ),
    { dispatch: false },
  );

  loadMap$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loadMap)),
      this.actions$.pipe(ofType(loadedMapLibrary)),
    ]).pipe(
      switchMap((actions) =>
        fromPromise(
          this.mapService$.createMap(
            actions[0].map,
            cloneDeep(actions[0].config),
          ),
        ).pipe(map(() => loadedMap())),
      ),
    ),
  );

  loadRefugePoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRefuges),
      switchMap(() => this.refugeService.getRefuges()),
      map((refuges) => {
        if (refuges.status === 'correct')
          return loadedRefuges({ refuges: refuges.data });
        return loadRefugesError({ error: refuges.error });
      }),
    ),
  );

  loadRefugePointsOnMap = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loadedRefuges)),
      this.actions$.pipe(ofType(loadedMap)),
    ]).pipe(
      tap((mapAndRefuges) =>
        // TODO: Check for errors here
        this.mapService$.addRefuges(mapAndRefuges[0].refuges, (refuge) => {
          this.store.dispatch(setRefuge({ refuge }));
          this.store.dispatch(setOpen());
        }),
      ),
      map((mapAndRefuges) => loadedRefugesOnMap()),
    ),
  );

  async fetchGoogleMapsLibrary() {
    const mapsLibrary = await fetch(
      `https://maps.googleapis.com/maps/api/js?key=${secretEnvironment.mapsKey}&libraries=places&language=ca`,
    );
    const mapsLibraryCode = await mapsLibrary.text();
    eval(mapsLibraryCode);
  }
}
