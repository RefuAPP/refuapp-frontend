import { createAction } from '@ngrx/store';

export const resourceNotFound = createAction('[Error] Resource Not Found');

export const programmingError = createAction('[Error] Programming Error');

export const connectionError = createAction('[Error] Connection Error');

export const unknownError = createAction('[Error] Unknown Error');

export const cleanError = createAction('[Error] Clean Error');
