import { Refuge } from 'src/app/schemas/refuge/refuge';
import { ResourceErrors } from '../errors/resource';
import { ServerErrors } from '../errors/server';

export type CorrectGetRefugeResponse = {
  status: 'correct';
  data: Refuge;
};

export type ErrorGetRefugeResponse = {
  status: 'error';
  error: ResourceErrors | ServerErrors;
};

export type GetRefugeResponse =
  | CorrectGetRefugeResponse
  | ErrorGetRefugeResponse;
