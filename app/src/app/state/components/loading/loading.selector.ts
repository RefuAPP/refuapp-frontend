import { createSelector } from '@ngrx/store';
import { selectMap } from '../../map/map.selectors';

export type LoadingState = {
  isLoading: boolean;
  keyMessage?: string;
};

export const isLoading = createSelector(selectMap, (map) => {
  if (map.loadingMap)
    return {
      isLoading: true,
      keyMessage: 'TODO: LOADING_MAP',
    } as LoadingState;
  return { isLoading: false } as LoadingState;
});
