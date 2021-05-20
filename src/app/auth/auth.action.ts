import { createAction, props } from '@ngrx/store';

import { User } from './models';

export const login = createAction(
  '[Login Page] User Action',
  props<{ user: User }>()
);

export const logout = createAction(
    '[Sidenav] Logout Menu'
)