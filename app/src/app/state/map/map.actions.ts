import { createAction, props } from '@ngrx/store';
import { ElementRef } from '@angular/core';
import { GoogleMapConfig } from '@capacitor/google-maps/dist/typings/definitions';
import { Coordinates } from '../../services/search/search.service';

export const loadMap = createAction(
  '[Map] Loading Map',
  props<{ map: ElementRef; config: GoogleMapConfig }>(),
);

export const loadedMap = createAction('[Map] Loaded Map');

export const destroyMap = createAction('[Map] Destroying Map');

export const moveMapTo = createAction(
  '[Map] Moving Map to Coordinates',
  props<{ coordinates: Coordinates }>(),
);

export const loadedRefugesOnMap = createAction(
  '[Map] Loaded All Refuges On Map',
);
