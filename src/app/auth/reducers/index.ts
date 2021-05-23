import { createReducer, MetaReducer, on } from '@ngrx/store';

import { AuthActions } from '../auth-action.types';
import { User } from '../models';

export const authFeatureKey = 'auth';

export interface AuthState {
  user: User;
}

export const initialAuthState: AuthState = { user: null };

export const reducers = createReducer(
  initialAuthState,
  on(AuthActions.saveUser, (state, action): AuthState => {
    return {
      user: action.user,
    };
  }),
  on(AuthActions.logout, (state, action): AuthState => {
    return {
      user: undefined,
    };
  })
);

export const metaReducers: MetaReducer<AuthState>[] = [];
