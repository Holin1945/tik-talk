import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { Chat, ChatsService, Message } from '@tt/data-access';
import { MessageInputComponent } from '../../../ui';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent, CommonModule],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatsService = inject(ChatsService);
  chat = input.required<Chat>();
  messages = this.chatsService.activeChatMessages;

  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }, 1200);
  }

   onSendMessage(messageText: string) {
    this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id);
    // await firstValueFrom(this.chatsService.sendMessage(this.chat().id, messageText));
    // await firstValueFrom(this.chatsService.getChatById(this.chat().id));
  }

  getGroupedMessages(): { label: string; messages: Message[] }[] {
    const groups = new Map<string, Message[]>();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    this.messages().forEach((mes) => {
      const day = new Date(mes.createdAt);

      const label =
        day.toDateString() === today
          ? 'Сегодня'
          : day.toDateString() === yesterday
          ? 'Вчера'
          : day.toLocaleDateString();

      (groups.get(label) ?? groups.set(label, []).get(label)!).push(mes);
    });

    return Array.from(groups, ([label, messages]) => ({ label, messages }));
  }
}
