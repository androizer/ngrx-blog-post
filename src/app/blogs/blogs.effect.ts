import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, iif } from 'rxjs';
import { catchError, concatMap, first, map, pluck } from 'rxjs/operators';

import { currentUserSelector } from '../auth/auth.selector';
import { BlogsAction } from './action.types';
import { allBlogsLoaded } from './blogs.action';
import { allBlogsSelector, blogsLoaded, selectBlog } from './blogs.selector';
import { Comment, Post } from './models';
import { BlogService } from './services';

@Injectable()
export class BlogsEffect {
  loadAllBlogsEffect$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(BlogsAction.loadAllBlogs),
        concatMap(() => this.store.select(blogsLoaded)),
        concatMap((isLoaded) => {
          return iif(
            () => !isLoaded,
            this.blogService
              .getAllPost({
                sort: { field: 'createdOn', order: 'DESC' },
              })
              .pipe(
                pluck('data'),
                // Convert blob to base64URL
                concatMap((payload) => {
                  const obs$ = payload.map((item) => {
                    return this.blogService.appendBase64Url(item);
                  });
                  return forkJoin(obs$);
                })
              ),
            this.store.select(allBlogsSelector).pipe(first())
          );
        }),
        map((posts) => allBlogsLoaded({ posts }))
      );
    },
    { dispatch: true }
  );

  editBlogEffect$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(BlogsAction.editBlog),
        concatMap(({ update, formData }) => {
          return this.blogService
            .updatePost(update.id as string, formData)
            .pipe(
              concatMap((post) =>
                this.blogService.appendBase64Url(post as Post)
              )
            )
            .pipe(
              map((post) => {
                this._navigateToBlogs();
                return BlogsAction.blogUpdatedSuccess({
                  update: {
                    id: update.id as string,
                    changes: post,
                  },
                });
              }),
              catchError(async () => BlogsAction.blogUpdationFailure())
            );
        })
      );
    },
    { dispatch: true }
  );

  createBlogEffect$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(BlogsAction.addBlog),
        concatMap(({ formData }) => {
          return this.blogService.createPost(formData).pipe(
            concatMap((post) =>
              forkJoin([
                this.blogService.appendBase64Url(post),
                /**
                 * using first as store is always emitting and forkJoin waits for completion of observable
                 */
                this.store.select(currentUserSelector).pipe(first()),
              ]).pipe(
                map(([post, user]) => {
                  this._navigateToBlogs();
                  post.author.avatar = user.avatar;
                  return BlogsAction.blogAddedSuccess({ post });
                }),
                catchError(async () => BlogsAction.blogUpdationFailure())
              )
            )
          );
        })
      );
    },
    { dispatch: true }
  );

  addCommentToBlogEffect$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(BlogsAction.addCommentToBlog),
        concatLatestFrom(({ commentId, postId }) =>
          this.store.select(selectBlog(postId))
        ),
        map(([{ commentId, postId }, post]) => {
          const newPost = new Post(post);
          newPost.comments.push(
            new Comment({
              id: commentId,
            })
          );
          return BlogsAction.blogUpdatedSuccess({
            update: {
              changes: newPost,
              id: postId,
            },
          });
        })
      );
    },
    { dispatch: true }
  );

  constructor(
    private readonly action$: Actions,
    private readonly blogService: BlogService,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  _navigateToBlogs() {
    setTimeout(() => this.router.navigate(['/blogs']), 1000);
  }
}
