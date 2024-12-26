import { FastifyInstance, FastifyReply } from "fastify";
import { score, game, account } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class ScoreController {
  constructor(private fastify: FastifyInstance) {}

  async getAllScores() {
    const scores = await this.fastify.db
      .select({
        id: score.id,
        score: score.score,
        gameId: score.gameId,
        accountId: score.accountId,
        createdAt: score.createdAt,
        gameName: game.name,
        accountAddress: account.address,
      })
      .from(score)
      .leftJoin(game, eq(score.gameId, game.id))
      .leftJoin(account, eq(score.accountId, account.id));

    return scores;
  }

  async getScoreById(id: number | string, reply: FastifyReply) {
    const result = await this.fastify.db
      .select({
        id: score.id,
        score: score.score,
        gameId: score.gameId,
        accountId: score.accountId,
        createdAt: score.createdAt,
        gameName: game.name,
        accountAddress: account.address,
      })
      .from(score)
      .leftJoin(game, eq(score.gameId, game.id))
      .leftJoin(account, eq(score.accountId, account.id))
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
    gameId: number | string,
    accountId: number | string,
    scoreValue: number,
    reply: FastifyReply
  ) {
    // 验证游戏和账户是否存在
    const [gameExists, accountExists] = await Promise.all([
      this.fastify.db
        .select()
        .from(game)
        .where(eq(game.id, parseInt(gameId.toString()))),
      this.fastify.db
        .select()
        .from(account)
        .where(eq(account.id, parseInt(accountId.toString()))),
    ]);

    if (!gameExists.length) {
      reply.code(404);
      throw new Error("Game not found");
    }

    if (!accountExists.length) {
      reply.code(404);
      throw new Error("Account not found");
    }

    // 验证分数是否为正数
    if (scoreValue < 0) {
      reply.code(400);
      throw new Error("Score must be a positive number");
    }

    const result = await this.fastify.db
      .insert(score)
      .values({
        gameId: parseInt(gameId.toString()),
        accountId: parseInt(accountId.toString()),
        score: scoreValue,
      })
      .returning();

    return result[0];
  }

  async updateScore(
    id: number | string,
    scoreValue: number,
    reply: FastifyReply
  ) {
    // 验证分数记录是否存在
    const scoreExists = await this.fastify.db
      .select()
      .from(score)
      .where(eq(score.id, parseInt(id.toString())));

    if (!scoreExists.length) {
      reply.code(404);
      throw new Error("Score not found");
    }

    // 验证分数是否为正数
    if (scoreValue < 0) {
      reply.code(400);
      throw new Error("Score must be a positive number");
    }

    const result = await this.fastify.db
      .update(score)
      .set({
        score: scoreValue,
      })
      .where(eq(score.id, parseInt(id.toString())))
      .returning();

    return result[0];
  }

  async deleteScore(id: number | string, reply: FastifyReply) {
    const result = await this.fastify.db
      .delete(score)
      .where(eq(score.id, parseInt(id.toString())))
      .returning();

    if (!result.length) {
      reply.code(404);
      throw new Error("Score not found");
    }

    return result[0];
  }

  async getTopScores(gameId: number | string, limit: number = 10, reply: FastifyReply) {
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
}
