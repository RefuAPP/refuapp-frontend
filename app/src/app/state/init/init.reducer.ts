import { createReducer, on } from '@ngrx/store';
import { loadedMapLibrary, loadMapLibrary } from './init.actions';

export type InitializerStatus = {
  isFetchingLibraries: boolean;
  mapLibraryLoaded: boolean;
};

export const initialState = {
  mapLibraryLoaded: false,
  isFetchingLibraries: false,
} as InitializerStatus;

export const initReducer = createReducer(
  initialState,
  on(loadMapLibrary, (state) => ({
    mapLibraryLoaded: false,
    isFetchingLibraries: true,
  })),
  on(loadedMapLibrary, (state) => ({
    isFetchingLibraries: false,
    mapLibraryLoaded: true,
  })),
);
