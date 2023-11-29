import { P } from 'ts-pattern/dist';
import { Phone } from '../phone/phone';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

export type UserCredentials = {
  phone_number: Phone;
  password: string;
};

export type User = {
  id: string;
  username: string;
  emergency_number: Phone;
} & UserCredentials;

export type CreateUser = Omit<User, 'id'>;
export type UpdateUser = User;

export type UserCreated = Omit<User, 'password'>;
export type UserUpdated = Omit<User, 'password'>;

export type UserForm = CreateUser & { repeatPassword: string };

export const UserCredentialsPattern: P.Pattern<UserCredentials> = {};
export const CreateUserPattern: P.Pattern<CreateUser> = {};
export const UserCreatedPattern: P.Pattern<UserCreated> = {};
export const UserUpdatedPattern: P.Pattern<UserUpdated> = {};
export const UserPattern: P.Pattern<User> = {};

export function isValidId(id: string): boolean {
  return uuidValidate(id) && uuidVersion(id) === 4;
}
