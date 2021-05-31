import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CreateQueryParams } from '@nestjsx/crud-request';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';

import { AuthActions } from '../../../auth/redux/auth.actions';
import { AuthSelectors } from '../../../auth/redux/auth.selectors';
import { uuid } from '../../../core/types';
import { Post } from '../../models';
import { BlogService } from '../../services';
import { CommentActions, PostActions } from '../actions';
import { PostSelectors } from '../selectors';

@Injectable()
export class PostEffects {
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly action$: Actions,
    private readonly blogService: BlogService
  ) {}

  queryAll$ = createEffect(() =>
    this.action$.pipe(
      ofType(PostActions.queryAll),
      concatLatestFrom(() => this.store.select(PostSelectors.isLoaded)),
      mergeMap(([{ query }, loaded]) => {
        if (loaded) {
          return this.store.select(PostSelectors.getAllPost);
        }
        return this.blogService.getAllPost(query).pipe(map(({ data }) => data));
      }),
      concatLatestFrom(() => this.store.select(AuthSelectors.currentUser)),
      map(([posts, user]) => {
        const data = posts.map((post) => {
          const userBookmarkIds = user.bookmarkIds;
          if (post.bookmarkedIds.some((id) => userBookmarkIds.includes(id))) {
            post.isBookmarked = true;
          }
          return post;
        });
        return PostActions.queryAllSuccess({ posts: data });
      }),
      catchError(() => [PostActions.queryAllError()])
    )
  );

  queryOne$ = createEffect(() =>
    this.action$.pipe(
      ofType(PostActions.queryOne),
      concatLatestFrom(({ id }) =>
        this.store.select(PostSelectors.getById(id))
      ),
      mergeMap(([{ id, query }, post]) => {
        if (!post) {
          return this.blogService
            .getPostById(id, query)
            .pipe(map((post) => PostActions.queryOneSuccess({ post })));
        }
        return [PostActions.emptyAction()];
      }),
      catchError(() => [PostActions.queryOneError()])
    )
  );

  queryOneWithComments$ = createEffect(() =>
    this.action$.pipe(
      ofType(PostActions.queryOneWithComments),
      concatLatestFrom(({ id }) =>
        this.store.select(PostSelectors.getById(id))
      ),
      mergeMap(([{ id, query }, post]) => {
        const commentQParams: CreateQueryParams = {
          join: [{ field: 'author' }, { field: 'author.avatar' }],
          sort: { field: 'createdOn', order: 'DESC' },
        };
        if (!post) {
          return this.blogService.getPostById(id, query).pipe(
            concatMap((post) => {
              const postId = post.id;
              return [
                PostActions.queryOneSuccess({ post }),
                CommentActions.queryAll({ postId, query: commentQParams }),
              ];
            })
          );
        }
        return [
          CommentActions.queryAll({
            postId: post.id,
            query: commentQParams,
          }),
        ];
      }),
      catchError(() => [PostActions.queryOneError()])
    )
  );

  createOne$ = createEffect(() =>
    this.action$.pipe(
      ofType(PostActions.createOne),
      mergeMap(({ post, query }) => this.blogService.createPost(post, query)),
      map((post) => {
        this.router.navigate(['/blogs']);
        return PostActions.createOneSuccess({ post });
      }),
      catchError(() => [PostActions.createOneError()])
    )
  );

  updateOne$ = createEffect(() =>
    this.action$.pipe(
      ofType(PostActions.updateOne),
      mergeMap(({ post, query }) => {
        const postId = post.id as uuid;
        return this.blogService
          .updatePost(postId, post.changes as FormData, query)
          .pipe(
            map((post) => {
              return { id: postId, changes: post } as Update<Post>;
            })
          );
      }),
      map((post) => {
        this.router.navigate(['/blogs']);
        return PostActions.updateOneSuccess({ post });
      }),
      catchError(() => [PostActions.updateOneError()])
    )
  );

  deleteOne$ = createEffect(() =>
    this.action$.pipe(
      ofType(PostActions.deleteOne),
      mergeMap(({ id }) => this.blogService.deletePost(id)),
      map(({ id }) => PostActions.deleteOneSuccess({ id })),
      catchError(() => [PostActions.deleteOneError()])
    )
  );

  toggleBookmark$ = createEffect(() =>
    this.action$.pipe(
      ofType(PostActions.toggleBookmark),
      concatMap(({ post }) =>
        this.blogService.toggleBookmark(post.id).pipe(
          catchError((err) => {
            PostActions.toggleBookmarkError({ postId: post.id });
            return throwError(err);
          })
        )
      ),
      concatLatestFrom(({ postId }) => [
        this.store.select(PostSelectors.getById(postId)),
      ]),
      concatMap(([payload, post]) => {
        const { bookmarkedIds } = this._updateBookmarkId(payload, post);
        return [
          PostActions.toggleBookmarkSuccess({
            changes: {
              id: post.id,
              changes: { bookmarkedIds },
            },
          }),
          AuthActions.toggleBookmark({
            bookmarkId: payload.id,
            isRemoved: payload.isRemoved,
          }),
        ];
      }),
      catchError(() => [PostActions.emptyAction])
    )
  );

  toggleUpvote$ = createEffect(() =>
    this.action$.pipe(
      ofType(PostActions.toggleUpvote),
      concatMap(({ post }) =>
        this.blogService.toggleVote(post.id).pipe(
          catchError((err) => {
            [PostActions.toggleUpvoteError({ post })];
            return throwError(err);
          })
        )
      ),
      map(({ votes, id }) => {
        return PostActions.toggleUpvoteSuccess({ id: id, votes });
      }),
      catchError(() => [PostActions.emptyAction()])
    )
  );

  /**
   * If the user just bookmark the post, then add the `bookmarkId`
   * to the post's `bookmarkedIds` array, else remove the `bookmarkId`.
   */
  private _updateBookmarkId(payload, post: Post) {
    const isBookmarked = payload.isRemoved ? false : true;
    let bookmarkedIds: uuid[] = [];
    if (isBookmarked) {
      bookmarkedIds = [...post.bookmarkedIds, payload.id];
    } else {
      const index = post.bookmarkedIds.findIndex((id) => id === payload.id);
      if (index >= 0) {
        bookmarkedIds = [...post.bookmarkedIds];
        bookmarkedIds.splice(index, 1);
      }
    }
    return {
      bookmarkedIds,
    };
  }
}
