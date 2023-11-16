import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { DeviceErrors } from '../../schemas/errors/device';

export const selectError = (state: AppState) => state.error;

export const clientHasErrorConnection = createSelector(
  selectError,
  (errorState) => errorState.fatalError === DeviceErrors.NOT_CONNECTED,
);

export const getMinorErrors = createSelector(selectError, (errorState) => {
  if (errorState.customMinorError) return errorState.customMinorError;
  return errorState.minorError as string;
});

export const hasMinorErrors = createSelector(selectError, (errorState) => {
  return (
    errorState.minorError !== undefined ||
    errorState.customMinorError !== undefined
  );
});
