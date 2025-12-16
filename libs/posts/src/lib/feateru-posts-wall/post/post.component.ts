import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommentComponent } from '../../ui/comment/comment.component';
import { AvatarCircleComponent, SvgIconComponent, TimeAgoPipe } from '@tt/common-ui';
import { PostInputComponent } from '../../ui';
import { Post, PostComment, PostService, ProfileService } from '@tt/data-access';

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
  postId = input<number>(0);
  comments = signal<PostComment[]>([]);
  postService = inject(PostService);
  profile = inject(ProfileService).me;

  async ngOnInit() {
    const post = this.post();
    if (post) {
      this.comments.set(post.comments);
    }
  }

  onCreated(commentText: string) {
    const profile = this.profile();
    const post = this.post();

    if (!profile || !post) return;

    firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: profile.id,
        postId: post.id,
      })
    )
      .then(async () => {
        const comments = await firstValueFrom(this.postService.getCommentsByPostId(post.id));
        this.comments.set(comments);
      })
      .catch((error) => console.error('Ошибка создания коммента', error));
  }
}
