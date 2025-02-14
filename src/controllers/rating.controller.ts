import { FastifyInstance } from "fastify";
import { gameRateV2 } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export class RatingController {
  constructor(private fastify: FastifyInstance) {}
  async putRate(gameId: string, isLike: boolean) {
    const parsedGameId = parseInt(gameId);
    // Try to update existing record first
    const result = await this.fastify.db
      .update(gameRateV2)
      .set({
        like: isLike ? sql`COALESCE("like", 0) + 1` : sql`"like"`,
        dislike: isLike ? sql`"dislike"` : sql`COALESCE("dislike", 0) + 1`
      })
      .where(eq(gameRateV2.gameId, parsedGameId))
      .returning();
    
    // If no record was updated, create a new one
    if (!result.length) {
      return this.fastify.db
        .insert(gameRateV2)
        .values({
          gameId: parsedGameId,
          like: isLike ? 1 : 0,
          dislike: isLike ? 0 : 1
        })
        .returning()
    }
    return result[0];
  }
}
