import { createFeature, createReducer, on } from '@ngrx/store';
import { Post, PostComment } from '@tt/data-access';
import { postsActions } from '../../data';

export interface PostsState {
  posts: Post[];
  comments: Record<number, PostComment[]>;
}

export const initialState: PostsState = {
  posts: [],
  comments: [],
};

export const postFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    initialState,

    on(postsActions.postsLoaded, (state, { posts }) => ({
      ...state,
      posts,
    })),

    on(postsActions.commentsLoaded, (state, { comments }) => {
      const stateComments = { ...state.comments };

      if (comments.length) {
        stateComments[comments[0]?.postId] = comments;
      }
      return {
        ...state,
        comments: stateComments,
      };
    })
  ),
});
