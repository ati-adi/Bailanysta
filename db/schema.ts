import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  int,
  primaryKey,
} from "drizzle-orm/mysql-core";

// Пользователи соцсети
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  handle: varchar("handle", { length: 60 }).notNull().unique(),
  avatar: varchar("avatar", { length: 255 }).notNull(),
  bio: varchar("bio", { length: 280 }).notNull().default(""),
  followers: int("followers").notNull().default(0),
  following: int("following").notNull().default(0),
});

// Посты
export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  authorId: varchar("author_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  likes: int("likes").notNull().default(0),
  comments: int("comments").notNull().default(0),
  reposts: int("reposts").notNull().default(0),
});

// Подписки: follower подписан на followee
export const follows = mysqlTable(
  "follows",
  {
    followerId: varchar("follower_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    followeeId: varchar("followee_id", { length: 36 })
      .notNull()
      .references(() => users.id),
  },
  (t) => [primaryKey({ columns: [t.followerId, t.followeeId] })],
);

// Лайки постов
export const postLikes = mysqlTable(
  "post_likes",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    postId: varchar("post_id", { length: 64 })
      .notNull()
      .references(() => posts.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.postId] })],
);
