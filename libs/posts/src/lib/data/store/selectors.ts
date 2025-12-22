import { createSelector } from '@ngrx/store';
import { postFeature } from '../../data';

export const selectPosts = createSelector(postFeature.selectPosts, (posts) => posts);

export const selectCommentsByPostId = (postId: number) =>
  createSelector(postFeature.selectComments, (comments) => comments[postId]);
