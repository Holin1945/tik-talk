import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { AuthService, ChatsService, ProfileService } from '@tt/data-access';
import { firstValueFrom, Subscription } from 'rxjs';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    SvgIconComponent,
    NgForOf,
    RouterLink,
    SubscriberCardComponent,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);
  chatsServiсe = inject(ChatsService);
  destroyRef = inject(DestroyRef);
  authService = inject(AuthService);

  subscribers$ = this.profileService.getSubscribersShortList();

  me = this.profileService.me;
  unreadMessagesCount = this.chatsServiсe.unreadMessagesCount;
  wsSubcribe!: Subscription;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

 async reconnect() {
   await firstValueFrom(this.authService.refreshAuthToken());
    this.connectWs();
  }

  connectWs() {
    this.wsSubcribe?.unsubscribe();
    this.wsSubcribe = this.chatsServiсe
      .connectWs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        if (message) {
          this.reconnect();
        }
      });
  }

  ngOnInit(): void {
    firstValueFrom(this.profileService.getMe());
  }
}
