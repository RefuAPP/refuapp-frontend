import { CreateUser, UserForm } from '../user';
import { format, isValid } from '../../phone/phone';

export enum UserFormError {
  PASSWORDS_DO_NOT_MATCH = 'PASSWORDS_DO_NOT_MATCH',
  INCORRECT_PHONE_NUMBER = 'INCORRECT_PHONE_NUMBER',
  INCORRECT_EMERGENCY_NUMBER = 'INCORRECT_EMERGENCY_NUMBER',
}

export function parseForm(form: UserForm): CreateUser | UserFormError {
  if (form.password !== form.repeatPassword)
    return UserFormError.PASSWORDS_DO_NOT_MATCH;
  const phone_number = format(form.phone_number);
  if (phone_number == null || !isValid(phone_number))
    return UserFormError.INCORRECT_PHONE_NUMBER;
  const emergency_number = format(form.emergency_number);
  if (emergency_number == null || !isValid(emergency_number))
    return UserFormError.INCORRECT_EMERGENCY_NUMBER;
  return {
    username: form.username,
    password: form.password,
    phone_number: phone_number,
    emergency_number: emergency_number,
  };
}
