import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import {
  errorLoadingMapLibrary,
  loadedMapLibrary,
  loadMapLibrary,
} from './init.actions';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { secretEnvironment } from '../../../environments/environment.secret';
import { connectionError, unknownError } from '../errors/error.actions';

@Injectable()
export class InitEffects {
  constructor(private actions$: Actions) {}

  loadLibrariesAtStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map((createData) => loadMapLibrary()),
    ),
  );

  loadGoogleMapsLibrary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMapLibrary),
      switchMap((createData) =>
        fromPromise(this.fetchGoogleMapsLibrary()).pipe(
          map(() => loadedMapLibrary()),
          catchError(() => [connectionError(), errorLoadingMapLibrary()]),
        ),
      ),
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
