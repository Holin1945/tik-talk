import { createActionGroup, props } from '@ngrx/store';
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '@tt/data-access';

export const postsActions = createActionGroup({
  source: 'posts',
  events: {
    'fetch posts': props<{ page?: number }>(),
    'posts loaded': props<{ posts: Post[] }>(),
    'create post': props<{ payload: PostCreateDto }>(),

    'fetch comments': props<{ postId: number }>(),
    'comments loaded': props<{ comments: PostComment[] }>(),
    'create comment': props<{ payload: CommentCreateDto }>(),
  },
});


