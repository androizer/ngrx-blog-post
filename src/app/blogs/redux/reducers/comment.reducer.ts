import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Comment } from '../../models';
import { CommentActions } from '../actions';

function sortByCreatedOn(c1: Comment, c2: Comment) {
  if (c1.createdOn > c2.createdOn) {
    return -1;
  } else if (c1.createdOn < c2.createdOn) {
    return 1;
  } else {
    return 0;
  }
}

export interface CommentState extends EntityState<Comment> {
  loaded: boolean;
  loading: boolean;
}

const adapter = createEntityAdapter<Comment>({
  sortComparer: sortByCreatedOn,
});

const initialState = adapter.getInitialState<CommentState>({
  entities: {},
  ids: [],
  loaded: false,
  loading: false,
});

export const commentReducer = createReducer(
  initialState,
  on(CommentActions.resetAll, (state) => {
    return adapter.removeAll({ ...state, loaded: false, loading: false });
  }),
  on(CommentActions.queryAll, (state) => {
    return {
      ...state,
      loaded: false,
      loading: true,
    };
  }),
  on(CommentActions.queryAllSuccess, (state, { comments }) => {
    return adapter.addMany(comments, {
      ...state,
      loaded: true,
      loading: false,
    });
  }),
  on(CommentActions.queryAllError, (state) => {
    return {
      ...state,
      loaded: false,
      loading: false,
    };
  }),
  on(CommentActions.createOne, (state) => ({ ...state, loading: true })),
  on(CommentActions.createOneError, (state) => ({ ...state, loading: false })),
  on(CommentActions.createOneSuccess, (state, { comment }) => {
    return adapter.addOne(comment, { ...state, loading: false });
  })
);

export const commentAdapter = adapter;

export const commentFeature = 'comments';
