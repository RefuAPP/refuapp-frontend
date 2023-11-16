import { User } from '../user';
import { ServerErrors } from '../../errors/server';
import { PermissionsErrors } from '../../errors/permissions';
import { ResourceErrors } from '../../errors/resource';

export type GetUserFromIdErrors =
  | ServerErrors
  | PermissionsErrors
  | ResourceErrors;

export type GetUserResponse =
  | {
      status: 'correct';
      data: User;
    }
  | {
      status: 'error';
      error: GetUserFromIdErrors;
    };
