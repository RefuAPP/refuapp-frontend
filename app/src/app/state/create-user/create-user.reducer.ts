import { createReducer, on } from '@ngrx/store';
import { ServerErrors } from '../../schemas/errors/server';
import { RepeatedData } from '../../schemas/user/create/create-user-error';
import { UserFormError } from '../../schemas/user/validate/form';
import {
  createUserCorrect,
  createUserDeviceError,
  createUserError,
  createUserRequest,
} from './create-user.actions';

export type CreateUserState = {
  userCreateForm: {
    phone_number: string;
    password: string;
    repeatPassword: string;
    username: string;
    emergency_number: string;
  };
  error?: RepeatedData | UserFormError;
  isLoading: boolean;
  deviceError?: ServerErrors;
};

export const emptyUserCreationState = {
  userCreateForm: {
    phone_number: '',
    password: '',
    repeatPassword: '',
    username: '',
    emergency_number: '',
  },
  isLoading: false,
} as CreateUserState;

export const createUserReducer = createReducer(
  emptyUserCreationState,
  on(createUserRequest, (state, action) => ({
    ...state,
    isLoading: true,
    userCreateForm: action.credentials,
  })),
  on(createUserCorrect, (state, action) => ({
    ...state,
    isLoading: false,
    userCreateForm: {
      phone_number: '',
      password: '',
      repeatPassword: '',
      username: '',
      emergency_number: '',
    },
  })),
  on(createUserError, (state, action) => ({
    ...state,
    userCreateForm: action.credentials,
    isLoading: false,
    error: action.error,
  })),
  on(createUserDeviceError, (state, action) => ({
    ...state,
    userCreateForm: action.credentials,
    isLoading: false,
    deviceError: action.error,
  })),
);
