import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { CURRENT_USER_ID } from "@contracts/types";
import { listUsers, toggleUserFollow } from "./queries/users";

export const usersRouter = createRouter({
  /** Все пользователи + флаги подписок текущего пользователя */
  list: publicQuery.query(() => listUsers(CURRENT_USER_ID)),

  /** Подписаться / отписаться */
  toggleFollow: publicQuery
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(({ input }) => toggleUserFollow(CURRENT_USER_ID, input.userId)),
});
