import { CreateQueryParams } from '@nestjsx/crud-request';
import { createAction, props } from '@ngrx/store';

import { uuid } from '../../../core/types';
import { Comment } from '../../models';

const queryAll = createAction(
  '[Post Detail Resolver] Query All (By Post ID)',
  props<{ postId: uuid; query: CreateQueryParams }>()
);

const queryAllSuccess = createAction(
  '[Comment Effects] Query All Success',
  props<{ comments: Comment[] }>()
);

const queryAllError = createAction('[Comment Effect] Query All Error');

const createOne = createAction(
  '[Post Detail Component] Create One',
  props<{ comment: string; postId: uuid; query?: CreateQueryParams }>()
);

const createOneSuccess = createAction(
  '[Comment Effects] Create One Success',
  props<{ comment: Comment }>()
);

const createOneError = createAction('[Comment Effects] Create One Error');

const resetAll = createAction('Reset All Comments');

export const CommentActions = {
  queryAll,
  queryAllSuccess,
  queryAllError,
  createOne,
  createOneSuccess,
  createOneError,
  resetAll,
};
