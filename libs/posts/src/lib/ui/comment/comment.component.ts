import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common-ui';
import { PostComment } from '@tt/data-access';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
