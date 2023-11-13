import { createReducer, on } from '@ngrx/store';
import { addSearch, addSearchCompletions, clearSearch } from './search.actions';
import { Coordinates } from '../../../services/search/search.service';

export type Completion = {
  description: string;
  coordinate: Coordinates;
};

export type SearchState = {
  search: string;
  completions: Completion[];
};

export const searchState = {
  search: '',
  completions: [],
} as SearchState;

export const searchReducer = createReducer(
  searchState,
  on(addSearch, (state, action) => ({
    ...state,
    search: action.search,
  })),
  on(addSearchCompletions, (state, action) => ({
    ...state,
    completions: action.completions,
  })),
  on(clearSearch, (state, action) => ({
    search: '',
    completions: [],
  })),
);
