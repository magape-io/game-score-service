import { FastifyInstance, FastifyReply } from "fastify";
import { score, game, account } from "../db/schema";
import { eq, desc, and, SQL } from "drizzle-orm";

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

  async getScores({ 
    address, 
    gameId, 
    limit = 10 
  }: { 
    address?: string; 
    gameId?: number; 
    limit?: number 
  }, 
    reply: FastifyReply
  ) {
    let query = this.fastify.db
      .select({
        id: score.id,
        score: score.score,
        gameId: score.gameId,
        accountId: score.accountId,
        createdAt: score.createdAt,
        accountAddress: account.address,
        gameName: game.name,
      })
      .from(score)
      .leftJoin(account, eq(score.accountId, account.id))
      .leftJoin(game, eq(score.gameId, game.id));

    const conditions: SQL[] = [];

    if (address) {
      conditions.push(eq(account.address, address));
    }

    if (gameId) {
      conditions.push(eq(score.gameId, gameId));
    }

    const result = await query
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(score.createdAt))
      .limit(limit);

    return result;
  }

  async getScoresByAddress(address: string, reply: FastifyReply) {
    const accountResult = await this.fastify.db
      .select()
      .from(account)
      .where(eq(account.address, address));

    if (!accountResult.length) {
      reply.code(404);
      throw new Error("Account not found");
    }

    const accountId = accountResult[0].id;
    
    const result = await this.fastify.db
      .select({
        id: score.id,
        score: score.score,
        gameId: score.gameId,
        accountId: score.accountId,
        createdAt: score.createdAt,
        accountAddress: account.address,
        gameName: game.name,
      })
      .from(score)
      .where(eq(score.accountId, accountId))
      .leftJoin(account, eq(score.accountId, account.id))
      .leftJoin(game, eq(score.gameId, game.id))
      .orderBy(desc(score.createdAt));

    return result;
  }

  async getScoresByAddressAndGame(address: string, gameId: number | string, reply: FastifyReply) {
    const accountResult = await this.fastify.db
      .select()
      .from(account)
      .where(eq(account.address, address));

    if (!accountResult.length) {
      reply.code(404);
      throw new Error("Account not found");
    }

    const accountId = accountResult[0].id;
    
    const result = await this.fastify.db
      .select({
        id: score.id,
        score: score.score,
        gameId: score.gameId,
        accountId: score.accountId,
        createdAt: score.createdAt,
        accountAddress: account.address,
        gameName: game.name,
      })
      .from(score)
      .where(and(
        eq(score.accountId, accountId),
        eq(score.gameId, Number(gameId))
      ))
      .leftJoin(account, eq(score.accountId, account.id))
      .leftJoin(game, eq(score.gameId, game.id))
      .orderBy(desc(score.createdAt));

    return result;
  }

  async updateScoreByAddress(address: string, gameId: number, newScore: number, reply: FastifyReply) {
    // First find the account by address
    const accountResult = await this.fastify.db
      .select()
      .from(account)
      .where(eq(account.address, address));

    if (!accountResult.length) {
      reply.code(404);
      throw new Error("Account not found");
    }

    const accountId = accountResult[0].id;

    // Find existing score for this account and game
    const existingScore = await this.fastify.db
      .select()
      .from(score)
      .where(and(
        eq(score.accountId, accountId),
        eq(score.gameId, gameId)
      ));

    if (!existingScore.length) {
      // If no existing score, create new one
      return this.fastify.db.insert(score).values({
        score: newScore,
        gameId,
        accountId,
      });
    } else {
      // If existing score exists, update it
      return this.fastify.db
        .update(score)
        .set({ score: newScore })
        .where(eq(score.id, existingScore[0].id));
    }
  }

  async createScoreByAddress(
    address: string,
    gameId: number | string,
    scoreValue: number,
    reply: FastifyReply
  ) {
    // First find or create the account by address
    const accountResult = await this.fastify.db
      .select()
      .from(account)
      .where(eq(account.address, address));

    let accountId: number;
    
    if (!accountResult.length) {
      // Create new account if it doesn't exist
      const newAccount = await this.fastify.db
        .insert(account)
        .values({ address })
        .returning();
      accountId = newAccount[0].id;
    } else {
      accountId = accountResult[0].id;
    }

    // Create the score
    return this.fastify.db.insert(score).values({
      score: scoreValue,
      gameId: Number(gameId),
      accountId,
    });
  }
}
