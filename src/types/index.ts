export interface User {
  id: string;
  name: string;
  handle: string; // без @
  avatar: string;
  bio: string;
  isFollowed: boolean;
  followers: number;
  following: number;
}

export interface Post {
  id: string;
  author: User;
  text: string;
  createdAt: string; // ISO
  likes: number;
  comments: number;
  reposts: number;
  liked: boolean;
}

export interface Topic {
  tag: string;
  postsCount: number;
}

export type ToastType = 'success' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}
