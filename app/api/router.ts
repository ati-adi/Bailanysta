import { createRouter, publicQuery } from "./middleware";
import { postsRouter } from "./posts";
import { usersRouter } from "./users";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  posts: postsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
