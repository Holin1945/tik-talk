import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarCircleComponent } from '@tt/common-ui';
import { Profile } from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace-header',
  imports: [AvatarCircleComponent, CommonModule],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss',
})
export class ChatWorkspaceHeaderComponent {
  profile = input.required<Profile>();
}
