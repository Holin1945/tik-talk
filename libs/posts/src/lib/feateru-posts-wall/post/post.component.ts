import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AvatarCircleComponent, SvgIconComponent, TimeAgoPipe } from '@tt/common-ui';
import { GlobalStoreService, Post, PostComment } from '@tt/data-access';
import { postsActions } from '../../data';
import { PostInputComponent } from '../../ui';
import { CommentComponent } from '../../ui/comment/comment.component';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    CommonModule,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimeAgoPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();
  profile = inject(GlobalStoreService).me;
  store = inject(Store);
  // comments!: Signal<PostComment[]>;

  ngOnInit() {
    const post = this.post();
    if (!post) return;
    // this.comments = this.store.selectSignal(selectCommentsByPostId(post.id));
    // this.store.dispatch(postsActions.fetchPosts({}));
    this.store.dispatch(postsActions.fetchComments({ postId: post.id }));
  }

  onCreated(commentText: string) {
    if (!commentText) return;

    const profile = this.profile();
    const post = this.post();

    if (!profile || !post) return;

    this.store.dispatch(
      postsActions.createComment({
        payload: {
          text: commentText,
          authorId: profile.id,
          postId: post.id,
        },
      })
    );
  }
}
