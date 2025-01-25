import { FastifyInstance, FastifyReply } from "fastify";
import { game, score } from "../db/schema";
import { desc, eq, sql } from "drizzle-orm";

export class GameController {
  constructor(private fastify: FastifyInstance) {}

  async getAllGames() {
    try {
      // 使用子查询获取每个游戏的用户数量
      const gamesWithUserCount = await this.fastify.db
        .select({
          id: game.id,
          name: game.name,
          url: game.url,
          icon: game.icon,
          bannerImages: game.bannerImages,
          status: game.status,
          type: game.type,
          platforms: game.platforms,
          address: game.address,
          networkId: game.networkId,
          briefDescription: game.briefDescription,
          description: game.description,
          developers: game.developers,
          createBy: game.createBy,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
          userCount: sql<number>`COUNT(DISTINCT ${score.accountId})::int`
        })
        .from(game)
        .leftJoin(score, eq(game.id, score.gameId))
        .groupBy(game.id)
        .orderBy(desc(game.createdAt));

      return {
        code: 200,
        data: gamesWithUserCount,
        message: "success"
      };
    } catch (error) {
      console.error("Failed to fetch games:", error);
      throw error;
    }
  }

  async getGameById(id: number | string, reply: FastifyReply) {
    try {
      const gameDetail = await this.fastify.db
        .select({
          id: game.id,
          name: game.name,
          url: game.url,
          icon: game.icon,
          bannerImages: game.bannerImages,
          status: game.status,
          type: game.type,
          platforms: game.platforms,
          address: game.address,
          networkId: game.networkId,
          briefDescription: game.briefDescription,
          description: game.description,
          developers: game.developers,
          createBy: game.createBy,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
          userCount: sql<number>`COUNT(DISTINCT ${score.accountId})::int`
        })
        .from(game)
        .leftJoin(score, eq(game.id, score.gameId))
        .where(eq(game.id, parseInt(id.toString())))
        .groupBy(game.id)
        .limit(1);
      
      if (!gameDetail.length) {
        reply.code(404);
        throw new Error("Game not found");
      }

      return {
        code: 0,
        data: gameDetail[0],
        message: "success"
      };
    } catch (error) {
      console.error("Failed to fetch game detail:", error);
      throw error;
    }
  }
}
