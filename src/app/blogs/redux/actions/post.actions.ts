import { CreateQueryParams } from '@nestjsx/crud-request';
import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { uuid } from '../../../core/types';
import { Post } from '../../models';

const queryAll = createAction(
  '[Post Resolver] Query All',
  props<{ query?: CreateQueryParams }>()
);

const queryAllSuccess = createAction(
  '[Blog Effects] Query All Success',
  props<{ posts: Post[] }>()
);

const queryAllError = createAction('[Blog Effects] Query All Error');

const queryOne = createAction(
  '[Post Resolver] Query One',
  props<{ id: uuid; query?: CreateQueryParams }>()
);

const queryOneWithComments = createAction(
  '[Post Resolver] Query One With Comments',
  props<{ id: uuid; query?: CreateQueryParams }>()
);

const queryOneError = createAction('[Post Effects] Query One Error');

const queryOneSuccess = createAction(
  '[Post Effects] Query One Success',
  props<{ post: Post }>()
);

const createOne = createAction(
  '[Create Blog Component] Create One',
  props<{ post: FormData; query?: CreateQueryParams }>()
);

const createOneSuccess = createAction(
  '[Post Effects] Create One Success',
  props<{ post: Post }>()
);

const createOneError = createAction('[Post Effects] Create One Error');

const updateOne = createAction(
  '[Blog Detail Component] Update One',
  props<{ post: Update<FormData>; query?: CreateQueryParams }>()
);

const updateOneSuccess = createAction(
  '[Blog Effects] Update One Success',
  props<{ post: Update<Post> }>()
);

const updateOneError = createAction('[Blog Effects] Update One Error');

const deleteOne = createAction(
  '[Blog List Component] Delete One',
  props<{ id: uuid }>()
);

const deleteOneSuccess = createAction(
  '[Blog Effects] Delete One Success',
  props<{ id: uuid }>()
);

const deleteOneError = createAction('[Blog Effects] Delete One Error');

const toggleBookmark = createAction(
  '[Blog List Component] Toggle Bookmark',
  props<{ post: Post }>()
);

const toggleBookmarkSuccess = createAction(
  '[Post Effects] Toggle Bookmark Success',
  props<{ changes: Update<Post> }>()
);

const toggleBookmarkError = createAction(
  '[Post Effects] Toggle Bookmark Error',
  props<{ postId: uuid }>()
);

const toggleUpvote = createAction(
  '[Blog List Component] Toggle Upvote',
  props<{ post: Partial<Post> }>()
);

const toggleUpvoteError = createAction(
  '[Post Effects] Toggle Upvote Error',
  props<{ post: Partial<Post> }>()
);

const toggleUpvoteSuccess = createAction(
  '[Post Effects] Toggle Upvote Success',
  props<{ id: uuid; votes: Post['votes'] }>()
);

const addCommentIdAfterCreate = createAction(
  '[Comment Effect] Add Comment ID To Post',
  props<{ postId: uuid; commentId: uuid }>()
);

const triggerAddCommentId = createAction(
  '[Server Sent Event] Add Comment ID To Post',
  props<{ postId: uuid; commentId: uuid }>()
);

const resetAll = createAction('Reset All Posts');

const emptyAction = createAction('EMPTY_ACTION');

export const PostActions = {
  queryAll,
  queryAllError,
  queryAllSuccess,
  queryOne,
  queryOneWithComments,
  queryOneError,
  queryOneSuccess,
  createOne,
  createOneError,
  createOneSuccess,
  updateOne,
  updateOneError,
  updateOneSuccess,
  deleteOne,
  deleteOneError,
  deleteOneSuccess,
  toggleBookmark,
  toggleBookmarkError,
  toggleBookmarkSuccess,
  toggleUpvote,
  toggleUpvoteError,
  toggleUpvoteSuccess,
  addCommentIdAfterCreate,
  triggerAddCommentId,
  resetAll,
  emptyAction,
};
