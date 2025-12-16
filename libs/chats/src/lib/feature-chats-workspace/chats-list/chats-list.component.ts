import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest, map, startWith } from 'rxjs';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { ChatsService } from '@tt/data-access';

@Component({
  selector: 'app-chats-list',
  imports: [ChatsBtnComponent, AsyncPipe, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent {
  chatsService = inject(ChatsService);

  filterChatsControl = new FormControl('', { nonNullable: true });

  // chats$ = this.chatsService.getMyChats().pipe(
  //   switchMap((chats) => {
  //     return this.filterChatsControl.valueChanges.pipe(
  //       startWith(''),
  //       map((inputValue) => {
  //         return chats.filter((chat) => {
  //           return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
  //             .toLowerCase()
  //             .includes(inputValue.toLowerCase() ?? '');
  //         });
  //       })
  //     );
  //   })
  // );

  chats$ = combineLatest([
    this.chatsService.unreadChats(),
    this.filterChatsControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([chats, filter]) =>
      (chats ?? [])
        .map((chat) => ({
          ...chat,
          unreadMessages:
            (chat as any).unreadMessages ?? (chat as any).unread ?? (chat as any).unread_count ?? 0,
        }))
        .filter((chat) =>
          `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
            .toLowerCase()
            .includes((filter ?? '').toLowerCase())
        )
    )
  );
}
