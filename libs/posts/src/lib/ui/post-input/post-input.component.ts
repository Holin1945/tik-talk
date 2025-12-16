import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { GlobalStoreService } from '@tt/data-access';

@Component({
  selector: 'app-post-input',
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule, CommonModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  #globalStoreService = inject(GlobalStoreService);
  profile = inject(GlobalStoreService).me;
  isCommentInput = input(false);
  postId = input<number>(0);

  postText = '';

  @Output() created = new EventEmitter<string>();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatedPost() {
    if (this.postText.trim()) {
      this.created.emit(this.postText);
      this.postText = '';
    }
  }
}
