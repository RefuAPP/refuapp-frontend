import { createAction, props } from '@ngrx/store';
import { ElementRef } from '@angular/core';
import { GoogleMapConfig } from '@capacitor/google-maps/dist/typings/definitions';
import { Refuge } from '../../schemas/refuge/refuge';

export const loadMap = createAction(
  '[Map] Loading Map',
  props<{ map: ElementRef; config: GoogleMapConfig }>(),
);

export const loadedMap = createAction('[Map] Loaded Map');

export const destroyMap = createAction('[Map] Destroying Map');

export const loadRefuges = createAction('[Map] Load All Refuges');

// TODO: This error shouldn't be any
export const loadRefugesError = createAction(
  '[Map] Load All Refuges Error',
  props<{ error: any }>(),
);

export const loadedRefuges = createAction(
  '[Map] Loaded All Refuges',
  props<{ refuges: Refuge[] }>(),
);

export const loadedRefugesOnMap = createAction(
  '[Map] Loaded All Refuges On Map',
);
