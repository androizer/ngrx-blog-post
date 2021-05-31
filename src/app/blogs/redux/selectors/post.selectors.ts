import { createFeatureSelector, createSelector } from '@ngrx/store';
import { uuid } from '../../../core/types';

import { postAdapter, postFeature, PostState } from '../reducers';

const postSelectorFeature = createFeatureSelector<PostState>(postFeature);

const isLoaded = createSelector(postSelectorFeature, (state) => state.loaded);

const isLoading = createSelector(postSelectorFeature, (state) => state.loading);

const getAllPost = createSelector(postSelectorFeature, (state) =>
  postAdapter.getSelectors().selectAll(state)
);

const getById = (id: uuid) =>
  createSelector(postSelectorFeature, (state) => {
    return state.entities[id];
  });

export const PostSelectors = {
  getAllPost,
  isLoaded,
  isLoading,
  getById,
};
