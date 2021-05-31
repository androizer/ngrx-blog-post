import { createFeatureSelector, createSelector } from '@ngrx/store';
import { uuid } from '../../../core/types';
import { commentAdapter, commentFeature, CommentState } from '../reducers';

export const commentFeatureSelector =
  createFeatureSelector<CommentState>(commentFeature);

export const allComments = createSelector(commentFeatureSelector, (state) =>
  commentAdapter.getSelectors().selectAll(state)
);

/**
 *  Filter comments based on their ids
 * @param ids Comment IDs
 * @returns Post[]
 */
export const filterByIds = (ids: uuid[]) =>
  createSelector(allComments, (comments) =>
    comments.filter(({ id }) => ids.includes(id))
  );

export const isLoading = createSelector(
  commentFeatureSelector,
  (state) => state.loading
);

export const CommentSelectors = { allComments, filterByIds, isLoading };
