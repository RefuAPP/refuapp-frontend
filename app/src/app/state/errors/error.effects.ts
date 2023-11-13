import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import {
  cleanError,
  programmingError,
  resourceNotFound,
  unknownError,
} from './error.actions';

@Injectable()
export class ErrorEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
  ) {}

  redirectUnknownError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(unknownError),
        tap(() =>
          this.router
            .navigate(['/internal-error-page'])
            .then(() => console.log('Redirecting to internal error page')),
        ),
      ),
    { dispatch: false },
  );

  redirectProgrammingError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(programmingError),
        tap(() => this.router.navigate(['/programming-error']).then()),
      ),
    { dispatch: false },
  );

  redirectResourceNotFound$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resourceNotFound),
        tap(() => this.router.navigate(['/not-found-page']).then()),
      ),
    { dispatch: false },
  );

  redirectToHomeWhenCleaningErrors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(cleanError),
        tap(() => this.router.navigate(['/']).then()),
      ),
    { dispatch: false },
  );
}
