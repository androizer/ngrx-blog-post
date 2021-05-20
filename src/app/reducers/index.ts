import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

export interface AppState {}

/**
 * it should contains key value pair of reducers, key should be same as used in app.module.ts as stateKey for reducer
 */
export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [];
