import { Injectable } from '@angular/core';
import { CreateQueryParams } from '@nestjsx/crud-request';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { BlogsAction, CommentActions } from './action.types';
import { filterCommentSelector } from './comments.selector';
import { Post } from './models';
import { CommentService } from './services';

@Injectable()
export class CommentEffects {
  getCommentsInfo$ = createEffect(() => {
    return this.action$.pipe(
      ofType(CommentActions.getComment),
      concatLatestFrom(({ commentIdList }) =>
        this.store.select(filterCommentSelector(commentIdList))
      ),
      concatMap(([{ commentIdList }, comments]) => {
        const commentsIdMap = comments.map((comment) => comment.id);
        const withoutDataIds = commentIdList.filter(
          (id) => !commentsIdMap.includes(id)
        );
        if (withoutDataIds.length) {
          return this.commentsService
            .getAllComments(this._getCommentQueryObj(withoutDataIds))
            .pipe(
              map(({ data }) => CommentActions.addComments({ comments: data }))
            );
        }
        return of(CommentActions.updateStoreComments({comments}));
      })
    );
  });

  addCommentInfo$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(CommentActions.addOneComment),
        concatMap(({ content, postId }) => {
          return this.commentsService.createComment(content, postId).pipe(
            map((comment) => {
              // comment.post = new Post({ id: postId });
              return CommentActions.addOneCommentSuccess({ comment });
            }),
            catchError(async () => CommentActions.addOneCommentFailure())
          );
        })
      );
    },
    { dispatch: true }
  );

  addCommentToPost$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(CommentActions.addOneCommentSuccess),
        map(({ comment }) =>
          BlogsAction.addCommentToBlog({
            commentId: comment.id,
            postId: comment.post.id,
          })
        )
      );
    },
    { dispatch: true }
  );

  constructor(
    private readonly action$: Actions,
    private readonly store: Store,
    private readonly commentsService: CommentService
  ) {}

  // Private functions
  private _getCommentQueryObj(ids: string[]): CreateQueryParams {
    return {
      join: [{ field: 'author' }, { field: 'author.avatar' }],
      search: {
        id: { $in: ids },
      },
      //   filter: [{ field: 'id', operator: '$in', value: ids.join(',') }],
    };
  }
}
