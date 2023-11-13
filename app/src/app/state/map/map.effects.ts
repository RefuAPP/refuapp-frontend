import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { cloneDeep } from 'lodash';
import { openModal } from '../components/modal/modal.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { MapService } from '../../services/map/map.service';
import { RefugeService } from '../../services/refuge/refuge.service';
import {
  destroyMap,
  loadedMap,
  loadedRefuges,
  loadedRefugesOnMap,
  loadMap,
  loadRefuges,
  loadRefugesError,
  moveMapTo,
} from './map.actions';
import { loadedMapLibrary } from '../init/init.actions';

@Injectable()
export class MapEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private mapService$: MapService,
    private refugeService: RefugeService,
  ) {}

  loadRefugesAtStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map((createData) => loadRefuges()),
    ),
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

  destroyMap$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(destroyMap),
        tap(() => this.mapService$.destroyMap()),
      ),
    { dispatch: false },
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
        this.mapService$.addRefuges(mapAndRefuges[0].refuges, (refuge) => {
          this.store.dispatch(openModal({ refuge }));
        }),
      ),
      map((mapAndRefuges) => loadedRefugesOnMap()),
    ),
  );

  moveMapTo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(moveMapTo),
        tap((action) => this.mapService$.move(action.coordinates)),
      ),
    { dispatch: false },
  );
}
