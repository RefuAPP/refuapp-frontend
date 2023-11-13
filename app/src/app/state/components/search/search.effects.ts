import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  Coordinates,
  SearchService,
} from '../../../services/search/search.service';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { addSearch, addSearchCompletions } from './search.actions';
import { Completion } from './search.reducer';
import { loadedMapLibrary } from '../../init/init.actions';

@Injectable()
export class SearchEffects {
  private searchService: SearchService | undefined;

  constructor(private actions$: Actions) {}

  autoCompleteWhenSearch$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(addSearch)),
      this.actions$.pipe(ofType(loadedMapLibrary)),
    ]).pipe(
      tap(() => (this.searchService = new SearchService())),
      switchMap((searchData) =>
        this.searchService!.getPredictions(searchData[0].search),
      ),
      switchMap((predictions) => {
        const predictionsWithCoordinates = predictions.map(
          async (prediction) => {
            return {
              description: prediction.description,
              coordinate: await this.searchService!.toCoordinates(prediction),
            };
          },
        );
        return Promise.all(predictionsWithCoordinates);
      }),
      map<
        { description: string; coordinate: Coordinates | null }[],
        Completion[]
      >(
        (predictions) =>
          predictions.filter(
            (prediction) => prediction.coordinate !== null,
          ) as Completion[],
      ),
      map((predictions) => addSearchCompletions({ completions: predictions })),
    ),
  );
}
