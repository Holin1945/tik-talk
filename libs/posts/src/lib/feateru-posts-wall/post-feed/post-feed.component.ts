import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  Output,
  Renderer2,
} from '@angular/core';
import { debounceTime, firstValueFrom, fromEvent, Subject, takeUntil } from 'rxjs';
import { PostComponent } from '../post/post.component';
import { PostInputComponent } from '../../ui';
import { PostService, ProfileService } from '@tt/data-access';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  postService = inject(PostService);
  profile = inject(ProfileService).me;

  r2 = inject(Renderer2);
  hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  postId = input<number>(0);
  isCommentInput = input(false);

  feed = this.postService.posts;
  postText = '';

  @Output() created = new EventEmitter();

  private destroy$ = new Subject<void>();

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeFeed();
  }

  ngAfterViewInit(): void {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resizeFeed(): void {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  onCreatePost(postText: string) {
    if (!postText) return;

    firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: postText,
        authorId: this.profile()!.id,
      })
    )
      .then(() => {
        this.created.emit();
      })
      .catch((error) => {
        console.error('Ошибка вывода поста', error);
      });
    return;
  }
}
