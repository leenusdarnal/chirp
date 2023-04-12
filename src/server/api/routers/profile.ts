import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { filterUserForClient } from "../../helpers/filterUserForClient"

export const profileRouter = createTRPCRouter({
  getUserbyUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      })
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not Found",
        })
      }
      return filterUserForClient(user)
    }),
})
