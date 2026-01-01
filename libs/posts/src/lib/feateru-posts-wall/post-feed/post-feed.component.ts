import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalStoreService, PostService } from '@tt/data-access';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';
import { postsActions, selectPosts } from '../../data';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFeedComponent implements OnDestroy, AfterViewInit, OnInit {
  postService = inject(PostService);
  hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  profile = inject(GlobalStoreService).me;
  store = inject(Store);
  r2 = inject(Renderer2);

  postId = input<number>(0);
  isCommentInput = input(false);
  feed = this.store.selectSignal(selectPosts);

  postText = '';
  private destroy$ = new Subject<void>();

  @Output() created = new EventEmitter();

  @HostListener('window:resize')
  onResize(): void {
    this.resizeFeed();
  }

  ngOnInit() {
    this.store.dispatch(postsActions.fetchPosts({}));
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

    this.store.dispatch(
      postsActions.createPost({
        payload: {
          title: 'Клевый пост',
          content: postText,
          authorId: this.profile()?.id,
        },
      })
    );
  }
}
