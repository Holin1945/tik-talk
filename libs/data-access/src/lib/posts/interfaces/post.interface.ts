import { Profile } from '../../profile/interfaces/profile.interface';

export interface PostCreateDto {
  title: string;
  content: string;
  authorId: number | null | undefined;
}

export interface Post {
  id: number;
  title: 'string';
  communityId: number;
  content: string;
  author: Profile;
  images: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likesUsers: string;
  comments: PostComment[];
}

export interface PostComment {
  id: number;
  text: string;
  author: {
    id: 0;
    username: string;
    avatarUrl: string;
    subscribersAmount: 0;
  };
  postId: number;
  commentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateDto {
  text: string;
  authorId: number;
  postId: number;
}
