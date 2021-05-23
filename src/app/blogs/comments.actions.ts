import { createAction, props } from '@ngrx/store';

import { Comment } from './models';

export const getComment = createAction(
    "[View Blog] Get Blog Comments",
    props<{ commentIdList: Array<typeof Comment.prototype.id> }>()
)

export const addComments = createAction(
    "[GetComments] Side Effect",
    props<{ comments: Comment[] }>()
)

export const emptyAction = createAction(
    "[EmptyAction] Side Effect",
)