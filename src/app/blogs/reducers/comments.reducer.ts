import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { CommentActions } from '../action.types';
import { Comment, Post } from '../models';

export const commentsFeatureKey = 'comments';

export interface CommentsState extends EntityState<Comment> {
  hasLoaded: boolean;
}

export const commentsAdapter = createEntityAdapter<Comment>({});

export const initialCommentsState = commentsAdapter.getInitialState({
  hasLoaded: false,
});

export const commentsReducer = createReducer(
  initialCommentsState,
  on(CommentActions.addComments, (state, action) => {
    return commentsAdapter.upsertMany(action.comments, state);
  })
);

export const commentEntitySelectors = commentsAdapter.getSelectors();
