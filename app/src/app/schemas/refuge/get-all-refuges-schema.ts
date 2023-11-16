import { Refuge } from './refuge';
import { ServerErrors } from '../errors/server';

export type GetAllRefugesResponse =
  | {
      status: 'correct';
      data: Refuge[];
    }
  | {
      status: 'error';
      error: ServerErrors;
    };
