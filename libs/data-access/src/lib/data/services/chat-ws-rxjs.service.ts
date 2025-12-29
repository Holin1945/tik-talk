
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ChatConnectionWSParams, ChatWsService } from '../interfaces/chat-ws-service.interface';
import { finalize, Observable, tap } from 'rxjs';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';

export class ChatWsRxjsService implements ChatWsService {
  #socket: WebSocketSubject<ChatWSMessage> | null = null;

  connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token],
      });
    }
    return this.#socket.asObservable().pipe(
      tap((message) => params.handleMessage(message)),
      finalize(() => console.log('А чо это вы тут делаете? Кино уже давно кончилось')) 
    );
  }

  disconnect() {
    this.#socket?.complete();
  }

  sendMessage(text: string, chatId: number) {
    this.#socket?.next({
      text,
      chat_id: chatId,
    });
  }
}
