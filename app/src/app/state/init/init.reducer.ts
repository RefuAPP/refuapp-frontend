import { createReducer, on } from '@ngrx/store';
import { loadedMap, loadMap } from './init.actions';

export type InitializerStatus = {
  mapLibraryFetched: boolean;
  isLoading: boolean;
};

export const initialState = {
  mapLibraryFetched: false,
  isLoading: true,
} as InitializerStatus;

export const initReducer = createReducer(
  initialState,
  on(loadMap, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(loadedMap, (state) => ({
    ...state,
    isLoading: false,
    mapLibraryFetched: true,
  })),
);
