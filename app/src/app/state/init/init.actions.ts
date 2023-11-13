import { createAction, props } from '@ngrx/store';
import { ElementRef } from '@angular/core';
import { GoogleMapConfig } from '@capacitor/google-maps/dist/typings/definitions';
import { Refuge } from '../../schemas/refuge/refuge';

export const loadMapLibrary = createAction('[Init] Loading Map Library');

export const loadedMapLibrary = createAction('[Init] Loaded Map Library');

export const loadMap = createAction(
  '[Init] Loading Map',
  props<{ map: ElementRef; config: GoogleMapConfig }>(),
);

export const destroyMap = createAction('[Init] Destroying Map');

export const loadRefuges = createAction('[Init] Load All Refuges');

// TODO: This error shouldn't be any
export const loadRefugesError = createAction(
  '[Init] Load All Refuges Error',
  props<{ error: any }>(),
);

export const loadedRefuges = createAction(
  '[Init] Loaded All Refuges',
  props<{ refuges: Refuge[] }>(),
);

export const loadedRefugesOnMap = createAction(
  '[Init] Loaded All Refuges On Map',
);

export const loadedMap = createAction('[Init] Loaded Map');
