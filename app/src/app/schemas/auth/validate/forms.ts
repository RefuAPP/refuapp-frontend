import { UserCredentials } from '../../user/user';
import { format, isValid } from '../../phone/phone';

export enum CredentialsError {
  INCORRECT_PHONE_NUMBER = 'INCORRECT_PHONE_NUMBER',
}

export function parseCredentials(
  credentials: UserCredentials,
): UserCredentials | CredentialsError {
  const phone_number = format(credentials.phone_number);
  if (phone_number == null || !isValid(phone_number))
    return CredentialsError.INCORRECT_PHONE_NUMBER;
  return {
    phone_number: phone_number,
    password: credentials.password,
  };
}
