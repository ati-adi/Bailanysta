import { and, eq } from "drizzle-orm";
import { getDb } from "./connection";
import { follows, users } from "@db/schema";
import type { UserDTO } from "@contracts/types";

/** Все пользователи + флаг «viewer подписан» */
export async function listUsers(viewerId: string): Promise<UserDTO[]> {
  const db = getDb();
  const rows = await db
    .select({ user: users, followeeId: follows.followeeId })
    .from(users)
    .leftJoin(
      follows,
      and(eq(follows.followeeId, users.id), eq(follows.followerId, viewerId)),
    );

  return rows.map(({ user, followeeId }) => ({
    id: user.id,
    name: user.name,
    handle: user.handle,
    avatar: user.avatar,
    bio: user.bio,
    isFollowed: followeeId !== null,
    followers: user.followers,
    following: user.following,
  }));
}

/** Переключить подписку viewer'а на пользователя */
export async function toggleUserFollow(
  viewerId: string,
  userId: string,
): Promise<{ isFollowed: boolean }> {
  const db = getDb();
  const existing = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, viewerId), eq(follows.followeeId, userId)));

  if (existing.length > 0) {
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, viewerId), eq(follows.followeeId, userId)));
    return { isFollowed: false };
  }

  await db.insert(follows).values({ followerId: viewerId, followeeId: userId });
  return { isFollowed: true };
}
