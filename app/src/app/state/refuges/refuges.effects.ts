import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { MapService } from '../../services/map/map.service';
import { RefugeService } from '../../services/refuge/refuge.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { match } from 'ts-pattern';
import {
  loadedRefuges,
  loadRefuges,
  loadRefugesError,
} from './refuges.actions';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { ServerErrors } from '../../schemas/errors/server';
import { fatalError } from '../errors/error.actions';
import { DeviceErrors } from '../../schemas/errors/device';

@Injectable()
export class RefugesEffects {
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

  loadRefugePoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRefuges),
      switchMap(() => this.refugeService.getRefuges()),
      map((refuges) => {
        if (refuges.status === 'correct')
          return loadedRefuges({ refuges: refuges.data });
        return loadRefugesError({ error: refuges.error });
      }),
      catchError(() => of(fatalError({ error: DeviceErrors.NOT_CONNECTED }))),
    ),
  );

  getAllRefugesErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRefugesError),
      map((action) => fatalError({ error: action.error })),
    ),
  );
}
