import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { DeviceErrors } from '../../schemas/errors/device';

export const selectError = (state: AppState) => state.error;

export const clientHasErrorConnection = createSelector(
  selectError,
  (errorState) => errorState.fatalError === DeviceErrors.NOT_CONNECTED,
);

export const getMinorErrors = createSelector(selectError, (errorState) => {
  if (errorState.minorErrors.length !== 0) return errorState.minorErrors[0];
  return undefined;
});
