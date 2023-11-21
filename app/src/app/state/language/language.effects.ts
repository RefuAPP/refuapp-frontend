import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { catchError, map, of, switchMap, tap, zip } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  changeLanguageCorrect,
  changeLanguageError,
  changeLanguageRequest,
  forcedLanguage,
  forceLanguageRequest,
  removeForceLanguage,
} from './language.actions';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { LanguageStorage } from '../../services/translate/language-settings.service';
import { DeviceLanguageService } from '../../services/translate/device-language.service';
import { showMessages } from '../messages/message.actions';
import { customMinorError } from '../errors/error.actions';

const LANGUAGES_SUPPORTED = ['en', 'es', 'ca'];

@Injectable()
export class LanguageEffects {
  constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private languageSettings: LanguageStorage,
    private deviceLanguage: DeviceLanguageService,
  ) {}

  getDefaultLanguageOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        zip(
          fromPromise(this.languageSettings.getLanguageCode()),
          fromPromise(this.deviceLanguage.getCurrentLanguageCode()),
        ).pipe(
          map(([settingsLanguage, deviceLanguage]) => {
            if (settingsLanguage)
              return forcedLanguage({ languageCode: settingsLanguage });
            return changeLanguageRequest({ languageCode: deviceLanguage });
          }),
        ),
      ),
    ),
  );

  registerForceLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forceLanguageRequest),
      tap((createData) =>
        this.languageSettings.setLanguageCode(createData.languageCode),
      ),
      map((createData) =>
        forcedLanguage({ languageCode: createData.languageCode }),
      ),
    ),
  );

  registerDefaultLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forcedLanguage),
      map((createData) =>
        changeLanguageRequest({ languageCode: createData.languageCode }),
      ),
    ),
  );

  changeToDefaultLanguageWhenForcedLanguageIsRemoved$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeForceLanguage),
      switchMap(() =>
        fromPromise(this.deviceLanguage.getCurrentLanguageCode()).pipe(
          map((languageCode) => changeLanguageRequest({ languageCode })),
        ),
      ),
    ),
  );

  removeLanguageFromStorageSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeForceLanguage),
        tap(() => this.languageSettings.removeLanguageCode()),
      ),
    { dispatch: false },
  );

  registerSupportedLanguages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        tap(() => this.translateService.addLangs(LANGUAGES_SUPPORTED)),
      ),
    { dispatch: false },
  );

  changeLanguageRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeLanguageRequest),
      switchMap((createData) =>
        this.translateService.use(createData.languageCode).pipe(
          map(() =>
            changeLanguageCorrect({ languageCode: createData.languageCode }),
          ),
          catchError((error) => [
            changeLanguageError({
              error: error,
              languageCode: createData.languageCode,
            }),
            customMinorError({ error: 'SETTINGS.ERROR_CHANGING_LANGUAGE' }),
          ]),
        ),
      ),
    ),
  );
}
