import { createAction, props } from '@ngrx/store';

import { User } from './models';

export const login = createAction(
  '[Login Page] User Action',
  props<{ email: string, password: string }>()
);

export const saveUser = createAction(
  '[Login/Refresh] Side Effect',
  props<{ user: User }>()
);

export const logout = createAction('[Sidenav] Logout Menu');

export const loginFail = createAction(
  '[Login Failure] Side Effect',
);
