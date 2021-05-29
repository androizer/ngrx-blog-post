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

export const addOneComment = createAction(
    "[Blog Details] Add Comment",
    props<{ content: string, postId: string }>()
)

export const addOneCommentSuccess = createAction(
    "[Add Comment] Success Side Effect",
    props<{ comment: Comment }>()
)

export const addOneCommentFailure = createAction(
    "[Add Comment] Failure Side Effect",
)

export const updateStoreComments = createAction(
    "[EmptyAction] Side Effect",
    props<{ comments: Comment[] }>()
)