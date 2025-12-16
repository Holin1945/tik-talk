import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import { switchMap } from 'rxjs';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';
import { ChatsService, ProfileService } from '@tt/data-access';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    CommonModule,
    AsyncPipe,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  chatsService = inject(ChatsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me$ = toObservable(this.profileService.me);
  isMyPage = signal(false);

  subscribers$ = this.profileService.getSubscribersShortList(5);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;
      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId } });
  }
}
