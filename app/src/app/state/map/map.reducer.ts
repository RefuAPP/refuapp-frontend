import { createReducer, on } from '@ngrx/store';
import {
  destroyMap,
  loadedMap,
  loadedRefugesOnMap,
  loadMap,
} from './map.actions';

export type MapStatus = {
  loadingMap: boolean;
  isMapLoaded: boolean;
  refugesOnMap: boolean;
};

export const initialState = {
  loadingMap: false,
  isMapLoaded: false,
  refugesOnMap: false,
} as MapStatus;

export const mapReducer = createReducer(
  initialState,
  on(loadMap, (state) => ({
    ...state,
    loadingMap: true,
  })),
  on(loadedMap, (state) => ({
    ...state,
    loadingMap: false,
    isMapLoaded: true,
  })),
  on(destroyMap, (state) => ({
    ...state,
    isMapLoaded: false,
  })),
  on(loadedRefugesOnMap, (state) => ({
    ...state,
    refugesOnMap: true,
  })),
);
