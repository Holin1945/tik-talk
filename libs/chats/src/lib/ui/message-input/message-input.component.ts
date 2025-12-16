import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Output,
  Renderer2
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { ProfileService } from '@tt/data-access';

@Component({
  selector: 'app-message-input',
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule, CommonModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  r2 = inject(Renderer2);
  me = inject(ProfileService).me;
  postText = '';

  @Output() created = new EventEmitter<string>();
  @Output() sendClick = new EventEmitter();

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatedPost() {
    if (!this.postText) return;
    this.created.emit(this.postText);
    this.postText = '';
    this.sendClick.emit();
  }

  onKeyEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onCreatedPost();
    }
  }
}
