import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { cloneDeep } from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { MapService } from '../../services/map/map.service';
import { RefugeService } from '../../services/refuge/refuge.service';
import {
  destroyMap,
  loadedMap,
  loadedRefugesOnMap,
  loadMap,
  moveMapTo,
} from './map.actions';
import { loadedMapLibrary } from '../init/init.actions';
import { loadedRefuges } from '../refuges/refuges.actions';
import { fatalError } from '../errors/error.actions';
import { ServerErrors } from '../../schemas/errors/server';
import { openModal } from '../modal/modal.actions';

@Injectable()
export class MapEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private mapService$: MapService,
  ) {}

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
        ).pipe(
          map(() => loadedMap()),
          catchError(() =>
            of(fatalError({ error: ServerErrors.UNKNOWN_ERROR })),
          ),
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

  loadRefugePointsOnMap = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loadedRefuges)),
      this.actions$.pipe(ofType(loadedMap)),
    ]).pipe(
      switchMap((mapAndRefuges) =>
        fromPromise(
          this.mapService$.addRefuges(mapAndRefuges[0].refuges, (refuge) => {
            this.store.dispatch(openModal({ refuge }));
          }),
        ).pipe(
          map(() => loadedRefugesOnMap()),
          catchError(() =>
            of(fatalError({ error: ServerErrors.UNKNOWN_ERROR })),
          ),
        ),
      ),
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
