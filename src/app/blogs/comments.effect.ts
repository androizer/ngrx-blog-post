import { Injectable } from '@angular/core';
import { CreateQueryParams } from '@nestjsx/crud-request';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { CommentActions } from './action.types';
import {
  allCommentsSelector,
  filterCommentSelector,
} from './comments.selector';
import { CommentService } from './services';

@Injectable()
export class CommentEffects {
  getCommentsInfo$ = createEffect(
    () => {
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
          if (withoutDataIds.length) {}
          return this.commentsService.getAllComments(
            this._getCommentQueryObj(withoutDataIds)
          );
        }),
        map(({ data }) => CommentActions.addComments({ comments: data }))
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
          id: {$in: ids}
      }
    //   filter: [{ field: 'id', operator: '$in', value: ids.join(',') }],
    };
  }
}
