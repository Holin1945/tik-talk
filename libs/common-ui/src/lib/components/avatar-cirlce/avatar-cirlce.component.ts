import { Component, input } from '@angular/core';
import { ImgUrlPipe } from '../../pipes';

@Component({
  selector: 'app-avatar-circle',
  imports: [ImgUrlPipe],
  templateUrl: './avatar-cirlce.component.html',
  styleUrl: './avatar-cirlce.component.scss',
})
export class AvatarCircleComponent {
  avatarUrl = input<string | null>();
}
