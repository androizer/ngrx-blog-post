import { createEntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Post } from '../../models';
import { PostActions } from '../actions';

export interface PostState extends EntityState<Post> {
  loaded: boolean;
  loading: boolean;
}

const adapter = createEntityAdapter<Post>();

const initialState = adapter.getInitialState<PostState>({
  ids: [],
  entities: {},
  loaded: false,
  loading: false,
});

export const postReducer = createReducer(
  initialState,
  on(PostActions.resetAll, (state) => {
    return adapter.removeAll({ ...state, loaded: false, loading: false });
  }),
  on(PostActions.queryAll, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(PostActions.queryAllSuccess, (state, { posts }) => {
    return adapter.setAll(posts, { ...state, loaded: true, loading: false });
  }),
  on(PostActions.queryAllError, (state) => ({
    ...state,
    loading: false,
    loaded: false,
  })),
  on(
    PostActions.createOne,
    PostActions.queryOne,
    PostActions.updateOne,
    PostActions.deleteOne,
    (state) => ({
      ...state,
      loading: true,
    })
  ),
  on(
    PostActions.createOneError,
    PostActions.queryOneError,
    PostActions.updateOneError,
    PostActions.deleteOneError,
    PostActions.emptyAction,
    (state) => ({
      ...state,
      loading: false,
    })
  ),
  on(PostActions.createOneSuccess, (state, { post }) => {
    return adapter.addOne(post, { ...state, loading: false });
  }),
  on(PostActions.queryOneSuccess, (state, { post }) => {
    return adapter.upsertOne(post, { ...state, loading: false });
  }),
  on(PostActions.updateOneSuccess, (state, { post }) => {
    return adapter.updateOne(post, { ...state, loading: false });
  }),
  on(PostActions.deleteOneSuccess, (state, { id }) => {
    return adapter.removeOne(id, { ...state, loading: false });
  }),
  on(PostActions.toggleUpvote, (state, { post }) => {
    const update: Update<Post> = {
      id: post.id,
      changes: { isUpvoted: !post.isUpvoted },
    };
    return adapter.updateOne(update, { ...state, loading: true });
  }),
  on(PostActions.toggleUpvoteSuccess, (state, { id, votes }) => {
    const update: Update<Post> = {
      id: id,
      changes: { votes },
    };
    return adapter.updateOne(update, { ...state, loading: false });
  }),
  on(PostActions.toggleUpvoteError, (state, { post }) => {
    const update: Update<Post> = {
      id: post.id,
      changes: { isUpvoted: !post.isUpvoted },
    };
    return adapter.updateOne(update, { ...state, loading: false });
  }),
  on(PostActions.toggleBookmark, (state, { post }) => {
    const update: Update<Post> = {
      id: post.id,
      changes: { isBookmarked: !post.isBookmarked },
    };
    return adapter.updateOne(update, { ...state, loading: true });
  }),
  on(PostActions.toggleBookmarkSuccess, (state, { changes }) => {
    return adapter.updateOne(changes, { ...state, loading: false });
  }),
  on(PostActions.toggleBookmarkError, (state, { postId }) => {
    const post = adapter.getSelectors().selectEntities(state)[postId];
    const update: Update<Post> = {
      id: postId,
      changes: { isBookmarked: !post.isBookmarked },
    };
    return adapter.updateOne(update, { ...state, loading: false });
  }),
  on(
    PostActions.addCommentIdAfterCreate,
    PostActions.triggerAddCommentId,
    (state, { postId, commentId }) => {
      const post = adapter.getSelectors().selectEntities(state)[postId];
      if (post) {
        const update: Update<Post> = {
          id: post.id,
          changes: {
            commentIds: Array.from(new Set([...post.commentIds, commentId])),
          },
        };
        return adapter.updateOne(update, state);
      }
      return {
        ...state,
      };
    }
  )
);

export const postFeature = 'posts';

export const postAdapter = adapter;
