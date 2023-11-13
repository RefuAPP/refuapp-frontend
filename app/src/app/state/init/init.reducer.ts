import { createReducer, on } from '@ngrx/store';
import {
  destroyMap,
  loadedMap,
  loadedMapLibrary,
  loadedRefuges,
  loadedRefugesOnMap,
  loadMap,
  loadMapLibrary,
  loadRefuges,
  loadRefugesError,
} from './init.actions';

export type InitializerStatus = {
  // Libraries Loading
  loadingLibraries: boolean;
  mapLibraryFetched: boolean;
  // Libraries Loading
  loadingMap: boolean;
  mapLoaded: boolean;
  // Refuges Loading
  loadingRefuges: boolean;
  areRefugesLoaded: boolean;
  // Refuges On Map
  refugesOnMap: boolean;
};

export const initialState = {
  mapLibraryFetched: false,
  loadingLibraries: false,

  loadingMap: false,
  mapLoaded: false,

  loadingRefuges: false,
  areRefugesLoaded: false,

  refugesOnMap: false,
} as InitializerStatus;

export const initReducer = createReducer(
  initialState,
  on(loadMapLibrary, (state) => ({
    ...state,
    mapLibraryFetched: false,
    loadingLibraries: true,
  })),
  on(loadedMapLibrary, (state) => ({
    ...state,
    loadingLibraries: false,
    mapLibraryFetched: true,
  })),
  on(loadMap, (state) => ({
    ...state,
    loadingMap: true,
  })),
  on(loadedMap, (state) => ({
    ...state,
    loadingMap: false,
    mapLoaded: true,
  })),
  on(destroyMap, (state) => ({
    ...state,
    mapLoaded: false,
  })),
  on(loadRefugesError, (state) => ({
    ...state,
    loadingRefuges: false,
    areRefugesLoaded: false,
  })),
  on(loadRefuges, (state) => ({
    ...state,
    loadingRefuges: true,
  })),
  on(loadedRefuges, (state) => ({
    ...state,
    loadingRefuges: false,
    areRefugesLoaded: true,
  })),
  on(loadedRefugesOnMap, (state) => ({
    ...state,
    refugesOnMap: true,
  })),
);
