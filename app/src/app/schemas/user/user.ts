import { P } from 'ts-pattern/dist';
import { Phone } from '../phone/phone';

export type UserCredentials = {
  phone_number: Phone;
  password: string;
};

type User = {
  id: string;
  username: string;
  emergency_number: Phone;
} & UserCredentials;

export type CreateUser = Omit<User, 'id'>;

export type UserCreated = Omit<User, 'password'>;

export type UserForm = CreateUser & { repeatPassword: string };

export const UserCredentialsPattern: P.Pattern<UserCredentials> = {};
export const CreateUserPattern: P.Pattern<CreateUser> = {};
export const UserCreatedPattern: P.Pattern<UserCreated> = {};
