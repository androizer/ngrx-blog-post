import { createReducer, on } from '@ngrx/store';

import { User } from '../models';
import { AuthActions } from './auth.actions';

export const authFeature = 'auth';

export interface AuthState {
  user: User;
  accessToken: string;
  expiresIn: number;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  expiresIn: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSucceed, (state, action) => {
    return {
      ...state,
      accessToken: action.accessToken,
      expiresIn: action.expiresIn,
    };
  }),
  on(AuthActions.storeCurrentUser, (state, { user }) => ({
    ...state,
    user: new User(user),
  })),
  on(AuthActions.logoutSucceed, (state) => {
    return {
      ...state,
      user: null,
      accessToken: null,
      expiresIn: null,
    };
  }),
  on(AuthActions.refreshTokenSucceed, (state, { accessToken, expiresIn }) => {
    return {
      ...state,
      accessToken,
      expiresIn,
    };
  }),
  on(AuthActions.updateCurrentUser, (state, { user }) => {
    return {
      ...state,
      user: {
        ...state.user,
        ...user,
      },
    };
  })
);
