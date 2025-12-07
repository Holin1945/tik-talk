import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, switchMap, timer } from 'rxjs';
import { Chat, LastMessageRes, Message } from './../interfaces/chats.interface';
import { ProfileService } from './profile.service';

@Injectable({ providedIn: 'root' })
export class ChatsService {
  httt = inject(HttpClient);
  me = inject(ProfileService).me;

  activeChatMessages = signal<Message[]>([]);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  createChat(userId: number) {
    return this.httt.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.httt.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.httt.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,

            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });
        this.activeChatMessages.set(patchedMessages);

        return {
          ...chat,
          companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  sendMessage<Message>(chatId: number, message: string) {
    return this.httt.post(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }

  unreadChats(intervalMs = 1115000) {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.httt.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`))
    );
  }
}
