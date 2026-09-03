export * from "./errors";

// === Общие типы и константы, которые пересекают границу фронтенд ↔ бэкенд ===

/** Текущий пользователь прототипа (пока нет авторизации — она появится на Уровне 3+) */
export const CURRENT_USER_ID = "u-aliya";

/** Максимальная длина поста */
export const POST_MAX_LENGTH = 280;

export interface UserDTO {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  isFollowed: boolean;
  followers: number;
  following: number;
}

export interface PostDTO {
  id: string;
  author: UserDTO;
  text: string;
  createdAt: Date;
  likes: number;
  comments: number;
  reposts: number;
  liked: boolean;
}

export interface TopicDTO {
  tag: string;
  postsCount: number;
}
