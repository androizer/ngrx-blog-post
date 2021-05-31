import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';

import { CommentService } from '../../services';
import { CommentActions, PostActions } from '../actions';
import { CommentSelectors, PostSelectors } from '../selectors';

@Injectable()
export class CommentEffects {
  constructor(
    private readonly store: Store,
    private readonly action$: Actions,
    private readonly commentService: CommentService
  ) {}

  // find comment by ids
  // if the filteredComments.length === post.commentIds.length,
  // then return the comments
  // else fetch the comments from api and return
  queryAll$ = createEffect(() =>
    this.action$.pipe(
      ofType(CommentActions.queryAll),
      concatLatestFrom(({ postId }) =>
        this.store.select(PostSelectors.getById(postId))
      ),
      concatLatestFrom(([, post]) =>
        this.store.select(CommentSelectors.filterByIds(post.commentIds))
      ),
      concatMap(([[{ query }, post], comments]) => {
        if (post.commentIds.length === comments.length) {
          return of(comments);
        }
        // find difference of comment ids which are not in store already
        const diff = post.commentIds.filter(
          (id) => !comments.some((comment) => comment.id === id)
        );
        // append those comment ids to query
        query = {
          ...query,
          filter: [{ field: 'id', operator: '$in', value: diff }],
        };
        // fetch comments from API
        return this.commentService.getCommentByPost(post.id, query);
      }),
      map((payload) => {
        if (Array.isArray(payload)) {
          return CommentActions.queryAllSuccess({ comments: payload });
        }
        return CommentActions.queryAllSuccess({ comments: payload.data });
      }),
      catchError(() => [CommentActions.queryAllError()])
    )
  );

  createOne$ = createEffect(() =>
    this.action$.pipe(
      ofType(CommentActions.createOne),
      mergeMap(({ comment, postId, query }) =>
        this.commentService.createComment(comment, postId, query)
      ),
      concatMap((comment) => {
        // Add commentId to post
        return [
          CommentActions.createOneSuccess({ comment }),
          PostActions.triggerAddCommentId({
            commentId: comment.id,
            postId: comment.postId,
          }),
        ];
      }),
      catchError(() => [CommentActions.createOneError()])
    )
  );
}
