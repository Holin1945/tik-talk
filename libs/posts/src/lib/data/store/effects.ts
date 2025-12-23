import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService, ProfileService } from '@tt/data-access';
import { map, switchMap } from 'rxjs';
import { postsActions } from '../../data';

@Injectable({
  providedIn: 'root',
})
export class PostsEffects {
  postService = inject(PostService);
  profile = inject(ProfileService).me;

  actions$ = inject(Actions);

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.fetchPosts),
      switchMap(() =>
        this.postService.fetchPosts().pipe(map((posts) => postsActions.postsLoaded({ posts })))
      )
    )
  });

  createPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createPost),
      switchMap(({ payload }) =>
        this.postService
          .createPost({
            title: payload.title,
            content: payload.content,
            authorId: payload.authorId,
          })
          .pipe(map(() => postsActions.fetchPosts({})))
      )
    );
  });

  // Можно по сути обойтись без этого эффекта, коменты и так загружаются, но оставил пока это тут
  // loadComments$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(postsActions.fetchComments),
  //     switchMap(({ postId }) =>
  //       this.postService
  //         .getCommentsByPostId(postId)
  //         .pipe(map((comments) => postsActions.commentsLoaded({ comments })))
  //     )
  //   );
  // });

  createComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createComment),
      switchMap(({ payload }) =>
        this.postService
          .createComment({
            text: payload.text,
            authorId: payload.authorId,
            postId: payload.postId,
          })
          .pipe(map(() => postsActions.fetchPosts({})))
      )
    );
  });
}
