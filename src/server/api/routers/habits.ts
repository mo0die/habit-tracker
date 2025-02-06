import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { habits } from "@/server/db/schema";

import { and, eq,sql } from "drizzle-orm";

export const habitRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        createdById: z.string(),
        createdAt: z.date(),
        updatedAt: z.array(z.date()),
        counter: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.insert(habits).values({
          name: input.name,
          description: input.description,
          createdById: ctx.session.user.id,
          createdAt: input.createdAt,
          updatedAt: [...input.updatedAt],
          counter: input.counter,
        });
      } catch (error) {
        console.log(error);
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db
          .update(habits)
          .set({
            counter: sql`${habits.counter} + 1`,
          })
          .where(
            and(
              eq(habits.id, input.id),
              eq(habits.createdById, ctx.session.user.id),
            ),
          )
          .returning();

        if (!results) {
          throw new Error("Habit not found");
        }
        return results;
      } catch (error) {
        console.log(error);
      }
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db
        .select({
          id: habits.id,
          name: habits.name,
          description: habits.description,
          createdById: habits.createdById,
          createdAt: habits.createdAt,
          updatedAt: habits.updatedAt,
          counter: habits.counter,
        })
        .from(habits)
        .where(eq(habits.createdById, ctx.session.user.id));
    } catch (error) {
      console.log(error);
    }
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db
          .delete(habits)
          .where(
            and(
              eq(habits.id, input.id),
              eq(habits.createdById, ctx.session.user.id),
            ),
          );
      } catch (error) {
        console.log(error);
      }
    }),
});
