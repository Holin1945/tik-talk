import { Component, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AvatarCircleComponent } from '@tt/common-ui';
import { Message, Chat, LastMessageRes } from '@tt/data-access';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  message = input<Message>();
  comments = signal<Chat[]>([]);
  chat = input<LastMessageRes>();

  textWrap(text: string, max = 30): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...' : text;
  }
}
