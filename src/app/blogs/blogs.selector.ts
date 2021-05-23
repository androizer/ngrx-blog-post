import { createFeatureSelector, createSelector } from '@ngrx/store';
import { blogSelectors, blogsFeatureKey, BlogsState } from './reducers';

export const blogFeatureSelector =
  createFeatureSelector<BlogsState>(blogsFeatureKey);

export const allBlogsSelector = createSelector(
  blogFeatureSelector,
  blogSelectors.selectAll
);

export const selectBlog = id => createSelector(
  blogFeatureSelector,
  blogState => blogState.entities[id]
);

export const blogsLoaded = createSelector(
  blogFeatureSelector,
  (blogState) => blogState.hasLoaded
);
