import { createFeatureSelector, createSelector } from "@ngrx/store";
import { commentsFeatureKey, CommentsState, commentEntitySelectors } from "./reducers";

export const commentsFeatureSelector = createFeatureSelector<CommentsState>(
    commentsFeatureKey,
)

export const commentByIdSelector = id => createSelector(
    commentsFeatureSelector,
    state => state.entities[id]
)

export const allCommentsSelector = createSelector(
    commentsFeatureSelector,
    commentEntitySelectors.selectAll
)

export const filterCommentSelector = (ids: Array<string>) => createSelector(
    allCommentsSelector,
    comments => comments.filter(({id}) => ids.includes(id))
)