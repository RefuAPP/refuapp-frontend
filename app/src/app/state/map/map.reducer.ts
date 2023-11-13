import { createReducer, on } from '@ngrx/store';
import {
  destroyMap,
  loadedMap,
  loadedRefuges,
  loadedRefugesOnMap,
  loadMap,
  loadRefuges,
  loadRefugesError,
} from './map.actions';

export type MapStatus = {
  loadingMap: boolean;
  isMapLoaded: boolean;
  loadingRefuges: boolean;
  areRefugesLoaded: boolean;
  refugesOnMap: boolean;
};

export const initialState = {
  loadingMap: false,
  isMapLoaded: false,

  loadingRefuges: false,
  areRefugesLoaded: false,

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