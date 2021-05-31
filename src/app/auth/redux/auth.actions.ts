import { createAction, props } from '@ngrx/store';
import { uuid } from '../../core/types';

import { User } from '../models';

const loginRequested = createAction(
  '[Login Component] Login Requested',
  props<{ email: string; password: string }>()
);

const loginSucceed = createAction(
  '[Auth Effects] Login Succeed',
  props<{ accessToken: string; expiresIn: number }>()
);

const loginFailed = createAction('[Auth Service] Login Failed');

const currentUserRequested = createAction(
  '[Auth Effects] Current User Requested'
);

const storeCurrentUser = createAction(
  '[Auth Effects] Store Current User',
  props<{ user: User }>()
);

const updateCurrentUser = createAction(
  '[Effects] Update Current User',
  props<{ user: Partial<User> }>()
);

const refreshTokenRequestedByGuard = createAction(
  '[Token Guard] Token Refresh Requested'
);

const refreshTokenRequestedByInterceptor = createAction(
  '[Auth Interceptor] Token Refresh Requested'
);

const refreshTokenSucceed = createAction(
  '[Auth Effects] Token Refresh Succeed',
  props<{ accessToken: string; expiresIn: number }>()
);

const logoutRequested = createAction('[Navigation Drawer] Logout Requested');

const logoutSucceed = createAction('[Auth Effects] Logout Succeed');

const registration = createAction(
  '[Register Component] Registration',
  props<{ user: FormData }>()
);

const toggleBookmark = createAction(
  '[Post Effect] Toggle Bookmark For User',
  props<{ bookmarkId: uuid; isRemoved: boolean }>()
);

export const AuthActions = {
  loginRequested,
  loginSucceed,
  loginFailed,
  currentUserRequested,
  storeCurrentUser,
  updateCurrentUser,
  refreshTokenRequestedByGuard,
  refreshTokenRequestedByInterceptor,
  refreshTokenSucceed,
  logoutRequested,
  logoutSucceed,
  registration,
  toggleBookmark,
};
