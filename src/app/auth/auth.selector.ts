import { createFeatureSelector, createSelector } from '@ngrx/store';

import { authFeatureKey, AuthState } from './reducers';

const authFeatureSelector = createFeatureSelector<AuthState>(authFeatureKey);

export const loginSelector = createSelector(
  authFeatureSelector,
  (authState) => !!authState?.user
);

export const logoutSelector = createSelector(
  loginSelector,
  (isLoggedIn) => !isLoggedIn
);
