import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { Post } from './models';

export const loadAllBlogs = createAction('[Blogs Module] Load All Blogs');

export const allBlogsLoaded = createAction(
  '[Blogs Load Effect] All Blogs Loaded',
  props<{ posts: Post[] }>()
);

export const addBlog = createAction(
  '[Create-Update Blog Form] Create Blog',
  props<{ formData: FormData }>()
);

export const blogAddedSuccess = createAction(
  '[Create Blog Effect] Success',
  props<{ post: Post }>()
);

export const blogAdditionFailure = createAction(
  '[Create Blog Effect] Failure'
);

export const editBlog = createAction(
  '[Create-Update Blog Form] Blog Edited',
  props<{ update: Update<Post>; formData: FormData }>()
);

export const blogUpdatedSuccess = createAction(
  '[Edit Blog Effect] Success',
  props<{ update: Update<Post> }>()
);

export const blogUpdationFailure = createAction('[Edit Blog Effect] Failure');

export const addCommentToBlog = createAction(
  "[Blog Detail] Comment Added Side Effect",
  props<{commentId: string, postId: string}>()
)