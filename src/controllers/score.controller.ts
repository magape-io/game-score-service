import { FastifyInstance, FastifyReply } from "fastify";
import { score, game, account } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export class ScoreController {
  constructor(private fastify: FastifyInstance) {}

  async getAllScores() {
    return this.fastify.db
      .select({
        id: score.id,
        score: score.score,
        gameId: score.gameId,
        accountId: score.accountId,
        createdAt: score.createdAt,
        accountAddress: account.address,
        gameName: game.name
      })
      .from(score)
      .leftJoin(account, eq(score.accountId, account.id))
      .leftJoin(game,eq(game.id,score.gameId))
      .orderBy(desc(score.score));
  }

  async getScoreById(id: number | string, reply: FastifyReply) {
    const result = await this.fastify.db
      .select()
      .from(score)
      .where(eq(score.id, parseInt(id.toString())));
    if (!result.length) {
      reply.code(404);
      throw new Error("Score not found");
    }
    return result[0];
  }

  async getScoresByGameId(gameId: number | string, reply: FastifyReply) {
    // 验证游戏是否存在
    const gameExists = await this.fastify.db
      .select()
      .from(game)
      .where(eq(game.id, parseInt(gameId.toString())));

    if (!gameExists.length) {
      reply.code(404);
      throw new Error("Game not found");
    }

    const scores = await this.fastify.db
      .select({
        id: score.id,
        score: score.score,
        gameId: score.gameId,
        accountId: score.accountId,
        createdAt: score.createdAt,
        accountAddress: account.address,
      })
      .from(score)
      .leftJoin(account, eq(score.accountId, account.id))
      .where(eq(score.gameId, parseInt(gameId.toString())))
      .orderBy(score.score);

    return scores;
  }

  async createScore(
    accountId: number | string,
    gameId: number | string,
    scoreValue: number,
    reply: FastifyReply
  ) {
    // 验证账户是否存在
    const accountExists = await this.fastify.db
      .select()
      .from(account)
      .where(eq(account.id, parseInt(accountId.toString())));

    if (!accountExists.length) {
      reply.code(404);
      throw new Error("Account not found");
    }

    // 验证游戏是否存在
    const gameExists = await this.fastify.db
      .select()
      .from(game)
      .where(eq(game.id, parseInt(gameId.toString())));

    if (!gameExists.length) {
      reply.code(404);
      throw new Error("Game not found");
    }

    // 验证分数是否为正数
    if (scoreValue < 0) {
      reply.code(400);
      throw new Error("Score must be a positive number");
    }

    // 添加新的分数记录
    const newScore = await this.fastify.db
      .insert(score)
      .values({
        accountId: parseInt(accountId.toString()),
        gameId: parseInt(gameId.toString()),
        score: scoreValue,
      })
      .returning();

    return newScore[0];
  }

  async updateScore(
    id: number | string,
    scoreValue: number,
    reply: FastifyReply
  ) {
    // 验证分数是否为正数
    if (scoreValue < 0) {
      reply.code(400);
      throw new Error("Score must be a positive number");
    }

    const updatedScore = await this.fastify.db
      .update(score)
      .set({
        score: scoreValue,
      })
      .where(eq(score.id, parseInt(id.toString())))
      .returning();

    if (!updatedScore.length) {
      reply.code(404);
      throw new Error("Score not found");
    }

    return updatedScore[0];
  }

  async deleteScore(id: number | string, reply: FastifyReply) {
    const deletedScore = await this.fastify.db
      .delete(score)
      .where(eq(score.id, parseInt(id.toString())))
      .returning();

    if (!deletedScore.length) {
      reply.code(404);
      throw new Error("Score not found");
    }

    return deletedScore[0];
  }

  async getTopScores(
    gameId: number | string,
    limit: number = 10,
    reply: FastifyReply
  ) {
    // 验证游戏是否存在
    const gameExists = await this.fastify.db
      .select()
      .from(game)
      .where(eq(game.id, parseInt(gameId.toString())));

    if (!gameExists.length) {
      reply.code(404);
      throw new Error("Game not found");
    }

    const scores = await this.fastify.db
      .select({
        id: score.id,
        score: score.score,
        gameId: score.gameId,
        accountId: score.accountId,
        createdAt: score.createdAt,
        accountAddress: account.address,
      })
      .from(score)
      .leftJoin(account, eq(score.accountId, account.id))
      .where(eq(score.gameId, parseInt(gameId.toString())))
      .orderBy(score.score)
      .limit(limit);

    return scores;
  }

  // 获取游戏排行榜
  async getGameRanking(
    gameId: number | string,
    limit: number = 10,
    reply: FastifyReply
  ) {
    // 验证游戏是否存在
    const gameExists = await this.fastify.db
      .select()
      .from(game)
      .where(eq(game.id, parseInt(gameId.toString())));

    if (!gameExists.length) {
      reply.code(404);
      throw new Error("Game not found");
    }

    // 获取排行榜
    const rankings = await this.fastify.db
      .select({
        accountId: account.id,
        accountAddress: account.address,
        score: score.score,
        gameId: score.gameId,
        createdAt: score.createdAt,
      })
      .from(score)
      .leftJoin(account, eq(score.accountId, account.id))
      .where(eq(score.gameId, parseInt(gameId.toString())))
      .orderBy(desc(score.score))
      .limit(limit);

    return rankings;
  }
}
