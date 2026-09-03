import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./connection";
import { posts, postLikes, users } from "@db/schema";
import type { PostDTO, UserDTO } from "@contracts/types";

type UserRow = typeof users.$inferSelect;

function toUserDTO(row: UserRow, isFollowed: boolean): UserDTO {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    avatar: row.avatar,
    bio: row.bio,
    isFollowed,
    followers: row.followers,
    following: row.following,
  };
}

/** Лента постов: новые сверху, с автором и флагом «лайкнул ли viewer» */
export async function listPosts(viewerId: string): Promise<PostDTO[]> {
  const db = getDb();
  const rows = await db
    .select({
      post: posts,
      author: users,
      likedId: postLikes.postId,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .leftJoin(
      postLikes,
      and(eq(postLikes.postId, posts.id), eq(postLikes.userId, viewerId)),
    )
    .orderBy(desc(posts.createdAt));

  return rows.map(({ post, author, likedId }) => ({
    id: post.id,
    author: toUserDTO(author, false),
    text: post.text,
    createdAt: post.createdAt,
    likes: post.likes,
    comments: post.comments,
    reposts: post.reposts,
    liked: likedId !== null,
  }));
}

/** Создать пост от имени автора */
export async function createPost(authorId: string, text: string): Promise<PostDTO> {
  const db = getDb();
  const id = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await db.insert(posts).values({ id, authorId, text });

  const [author] = await db.select().from(users).where(eq(users.id, authorId));
  return {
    id,
    author: toUserDTO(author, false),
    text,
    createdAt: new Date(),
    likes: 0,
    comments: 0,
    reposts: 0,
    liked: false,
  };
}

/** Удалить пост (возвращает true, если пост существовал) */
export async function deletePost(postId: string): Promise<boolean> {
  const db = getDb();
  await db.delete(postLikes).where(eq(postLikes.postId, postId));
  const res = await db.delete(posts).where(eq(posts.id, postId));
  return (res[0]?.affectedRows ?? 0) > 0;
}

/** Переключить лайк viewer'а на посте; возвращает новое состояние */
export async function togglePostLike(
  viewerId: string,
  postId: string,
): Promise<{ liked: boolean; likes: number }> {
  const db = getDb();
  const existing = await db
    .select()
    .from(postLikes)
    .where(and(eq(postLikes.userId, viewerId), eq(postLikes.postId, postId)));

  if (existing.length > 0) {
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.userId, viewerId), eq(postLikes.postId, postId)));
    await db
      .update(posts)
      .set({ likes: Math.max(0, (await getLikes(postId)) - 1) })
      .where(eq(posts.id, postId));
  } else {
    await db.insert(postLikes).values({ userId: viewerId, postId });
    await db
      .update(posts)
      .set({ likes: (await getLikes(postId)) + 1 })
      .where(eq(posts.id, postId));
  }

  return { liked: existing.length === 0, likes: await getLikes(postId) };
}

async function getLikes(postId: string): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ likes: posts.likes })
    .from(posts)
    .where(eq(posts.id, postId));
  return row?.likes ?? 0;
}
