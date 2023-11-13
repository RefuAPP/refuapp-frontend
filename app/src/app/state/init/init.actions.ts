import { createAction } from '@ngrx/store';

export const loadMapLibrary = createAction('[Init] Loading Map Library');
export const errorLoadingMapLibrary = createAction(
  '[Init] Error Loading Map Library',
);
export const loadedMapLibrary = createAction('[Init] Loaded Map Library');
