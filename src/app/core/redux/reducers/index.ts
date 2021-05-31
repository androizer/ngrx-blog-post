import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

export interface GlobalState {
  router: RouterReducerState;
}

export const globalReducers: ActionReducerMap<GlobalState> = {
  router: routerReducer,
};

export const metaReducers: MetaReducer<GlobalState>[] = [];
