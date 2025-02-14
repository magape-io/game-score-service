import { FastifyInstance } from "fastify";
import { eq, sql } from "drizzle-orm";
import { gameRating } from "../db/schema";
import { RatingController } from "../controllers/rating.controller";

export async function ratingRoutes(fastify: FastifyInstance) {
  const accountController = new RatingController(fastify);
  // Rate a game (like/dislike)
  fastify.post<{
    Body: { gameId: number; isLike: boolean };
  }>("/rate", async (request, reply) => {
    const { gameId, isLike } = request.body;

    try {
      // Create new rating
      await fastify.db.insert(gameRating).values({
        gameId,
        isLike,
      });

      return { success: true };
    } catch (error) {
      console.error("Error rating game:", error);
      return reply.status(500).send({ error: "Failed to rate game" });
    }
  });

  // Get rating stats for a game
  fastify.get<{
    Params: { gameId: string };
  }>("/stats/:gameId", async (request, reply) => {
    const { gameId } = request.params;

    try {
      const stats = await fastify.db
        .select({
          likes: sql<number>`sum(case when ${gameRating.isLike} = true then 1 else 0 end)`,
          dislikes: sql<number>`sum(case when ${gameRating.isLike} = false then 1 else 0 end)`,
        })
        .from(gameRating)
        .where(eq(gameRating.gameId, parseInt(gameId)));

      return {
        likes: Number(stats[0].likes) || 0,
        dislikes: Number(stats[0].dislikes) || 0,
      };
    } catch (error) {
      console.error("Error getting rating stats:", error);
      return reply.status(500).send({ error: "Failed to get rating stats" });
    }
  });

  fastify.post<{Body: {gameId: string, isLike: boolean}}>("/v2",async(request,reply) => {
    const {gameId, isLike} = request.body
    const res = await accountController.putRate(gameId, isLike)
    return res
  })

  fastify.get<{
    Params: {
      gameId: string;
    };
  }>("/v2/:gameId",async(request,reply) => {
    const {gameId} = request.params
    const res = await accountController.getRate(gameId)
    return res
  })
}
