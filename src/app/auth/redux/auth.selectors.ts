import { createFeatureSelector, createSelector } from '@ngrx/store';

import { authFeature, AuthState } from './auth.reducer';

const authFeatureSelector =
  createFeatureSelector<Partial<AuthState>>(authFeature);

const accessToken = createSelector(
  authFeatureSelector,
  (state = {}) => state.accessToken
);

const expiresIn = createSelector(
  authFeatureSelector,
  (state = {}) => state.expiresIn
);

const currentUser = createSelector(
  authFeatureSelector,
  (state = {}) => state.user
);

const isLoggedIn = createSelector(currentUser, (user) => !!user);

const isLoggedOut = createSelector(isLoggedIn, (loggedIn) => !loggedIn);

export const AuthSelectors = {
  accessToken,
  expiresIn,
  currentUser,
  isLoggedIn,
  isLoggedOut,
};
