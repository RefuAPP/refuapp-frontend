import { ServerErrors } from './server';
import { PermissionsErrors } from './permissions';
import { ResourceErrors } from './resource';
import { DeviceErrors } from './device';
import { match } from 'ts-pattern';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

export type AllErrors =
  | ServerErrors
  | PermissionsErrors
  | ResourceErrors
  | DeviceErrors;

export function getErrorFrom(
  error: HttpErrorResponse,
): ServerErrors | PermissionsErrors | ResourceErrors | never {
  return match(error.status)
    .with(0, () => {
      throw new Error('You are offline or the server is down.');
    })
    .with(
      HttpStatusCode.Unauthorized,
      () => PermissionsErrors.NOT_AUTHENTICATED,
    )
    .with(
      HttpStatusCode.Forbidden,
      () => PermissionsErrors.NOT_ALLOWED_OPERATION_FOR_USER,
    )
    .with(HttpStatusCode.NotFound, () => ResourceErrors.NOT_FOUND)
    .with(
      HttpStatusCode.UnprocessableEntity,
      () => ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
    )
    .otherwise(() => ServerErrors.UNKNOWN_ERROR);
}
