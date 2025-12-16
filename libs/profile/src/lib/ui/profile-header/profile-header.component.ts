import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarCircleComponent } from '@tt/common-ui';
import { Profile, ProfileService } from '@tt/data-access';

@Component({
  selector: 'app-profile-header',
  imports: [AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
  profile = input<Profile | null>();
  profileService = inject(ProfileService);

  private router = inject(Router);

  get isSettings(): boolean {
    return this.router.url.startsWith('/settings');
  }
}
