import { ActionReducerMap } from '@ngrx/store';

import { commentReducer, CommentState } from './comment.reducer';
import { postReducer, PostState } from './post.reducer';

interface BlogReducerState {
  posts: PostState;
  comments: CommentState;
}

export const blogReducers: ActionReducerMap<BlogReducerState> = {
  posts: postReducer,
  comments: commentReducer,
};

export * from './post.reducer';
export * from './comment.reducer';
