import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';
import { ChatWsService } from '../interfaces/chat-ws-service.interface';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { AuthService } from '../services/auth.service';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import { ProfileService } from './profile.service';

@Injectable({ providedIn: 'root' })
export class ChatsService {
  httt = inject(HttpClient);
  #authService = inject(AuthService);
  me = inject(ProfileService).me;

  wsAdapter: ChatWsService = new ChatWsRxjsService();

  activeChatMessages = signal<Message[]>([]);
  activeChat = signal<Chat | null>(null);
  unreadMessagesCount = signal(0);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage,
    }) as Observable<ChatWSMessage>;
  }

  // #refreshToken() {
  //   this.#authService.refreshAuthToken().subscribe((TokenResponse: TokenResponse) => {
  //     console.log('Обновление токена', TokenResponse.access_token);

  //     this.wsAdapter.disconnect();
  //     this.connectWs();
  //   });
  // }

  handleWSMessage = (message: ChatWSMessage) => {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.unreadMessagesCount.set(message.data.count);
      console.log('Количество непрочитанных сообщений равно:', this.unreadMessagesCount());
    }

    if (isNewMessage(message)) {
      const me = this.me();
      const activeChat = this.activeChat();
      if (!me || !activeChat) return;

      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine: message.data.author === me.id,
          user:
            this.activeChat()?.userFirst.id === message.data.author
              ? activeChat.userFirst
              : activeChat.userSecond,
        },
      ]);
    }
  };

  createChat(userId: number) {
    return this.httt.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.httt.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.httt.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        this.activeChat.set(chat);
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

  sendMessage(chatId: number, message: string) {
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
}
