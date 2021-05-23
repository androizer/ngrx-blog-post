import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { BlogsAction } from '../action.types';
import { Post } from '../models';

export const blogsFeatureKey = 'blogs';

export interface BlogsState extends EntityState<Post> {
  hasLoaded: boolean;
}

export const blogsAdapter = createEntityAdapter<Post>({});

export const initialBlogsState = blogsAdapter.getInitialState({
  hasLoaded: false,
});

export const blogsReducer = createReducer(
  initialBlogsState,
  on(BlogsAction.allBlogsLoaded, (state, action) =>
    blogsAdapter.upsertMany(action.posts, { hasLoaded: true, ...state })
  ),
  on(BlogsAction.blogUpdatedSuccess, (state, action) =>
    blogsAdapter.updateOne(action.update, state)
  ),
  on(BlogsAction.blogAddedSuccess, (state, action) =>
    blogsAdapter.upsertOne(action.post, state)
  )
);

export const blogSelectors = blogsAdapter.getSelectors();
