import { P } from 'ts-pattern/dist';
import { Phone } from '../phone/phone';

type User = {
  id: string;
  username: string;
  password: string;
  phone_number: Phone;
  emergency_number: Phone;
};

export type CreateUser = Omit<User, 'id'>;

export type UserCreated = Omit<User, 'password'>;

export type UserForm = CreateUser & { repeatPassword: string };

export const CreateUserPattern: P.Pattern<CreateUser> = {};
export const UserCreatedPattern: P.Pattern<UserCreated> = {};
