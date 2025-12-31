import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common-ui';
import { LastMessageRes } from '@tt/data-access';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>();

  textWrap(text: string, max = 30): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...' : text;
  }
}
