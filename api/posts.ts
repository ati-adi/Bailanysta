import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { CURRENT_USER_ID, POST_MAX_LENGTH } from "@contracts/types";
import {
  createPost,
  deletePost,
  listPosts,
  togglePostLike,
} from "./queries/posts";

export const postsRouter = createRouter({
  /** Лента постов (новые сверху) */
  list: publicQuery.query(() => listPosts(CURRENT_USER_ID)),

  /** Создать пост от текущего пользователя */
  create: publicQuery
    .input(
      z.object({
        text: z.string().trim().min(1).max(POST_MAX_LENGTH),
      }),
    )
    .mutation(({ input }) => createPost(CURRENT_USER_ID, input.text)),

  /** Удалить свой пост */
  remove: publicQuery
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ input }) => ({ ok: await deletePost(input.postId) })),

  /** Лайк / снять лайк */
  toggleLike: publicQuery
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(({ input }) => togglePostLike(CURRENT_USER_ID, input.postId)),
});
