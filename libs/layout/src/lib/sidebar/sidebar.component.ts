import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { SvgIconComponent, ImgUrlPipe } from '@tt/common-ui';
import { ProfileService } from '@tt/data-access';

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
  subscribers$ = this.profileService.getSubscribersShortList();
  me = this.profileService.me;

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

  ngOnInit(): void {
    firstValueFrom(this.profileService.getMe());
  }
}
