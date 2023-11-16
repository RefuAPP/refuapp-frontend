import { Injectable } from '@angular/core';
import {
  Coordinates,
  SearchService,
} from '../../services/search/search.service';
import { ComponentStore } from '@ngrx/component-store';
import { map, switchMap, tap } from 'rxjs';

export type Completion = {
  description: string;
  coordinate: Coordinates;
};

export interface SearchState {
  search: string;
  completions: Completion[];
}

@Injectable()
export class SearchComponentStore extends ComponentStore<SearchState> {
  readonly search$ = this.select((state) => state.search);
  readonly completions$ = this.select((state) => state.completions);

  constructor(private readonly searchService: SearchService) {
    super({ search: '', completions: [] });
  }

  readonly search = this.updater((state: SearchState, search: string) => ({
    ...state,
    search,
  }));

  readonly clearSearch = this.updater((state) => ({
    search: '',
    completions: [],
  }));

  private readonly setCompletions = this.updater(
    (state: SearchState, completions: Completion[]) => ({
      ...state,
      completions,
    }),
  );

  private readonly completeAfterUpdatingSearch = this.effect((_) =>
    this.search$.pipe(
      switchMap((search) =>
        this.searchService.getPredictions(search).pipe(
          switchMap((predictions) => {
            const predictionsWithCoordinates = predictions.map(
              async (prediction) => {
                return {
                  description: prediction.description,
                  coordinate:
                    await this.searchService.toCoordinates(prediction),
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
          tap((predictions: Completion[]) => this.setCompletions(predictions)),
        ),
      ),
    ),
  );
}
