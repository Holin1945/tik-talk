import { Component, input, signal } from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-cirlce/avatar-cirlce.component';
import { Chat, LastMessageRes, Message } from '../../../data/interfaces/chats.interface';
import { DatePipe } from '@angular/common';

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

  textWrap(text: string, max: number = 30): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...' : text;
  }
}
