import { FastifyInstance, FastifyReply } from "fastify";
import { score, game, account, scoreName } from "../db/schema";
import { eq, desc, and, SQL, sql, gte, lte } from "drizzle-orm";

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
        gameName: game.name,
      })
      .from(score)
      .leftJoin(account, eq(score.accountId, account.id))
      .leftJoin(game, eq(game.id, score.gameId))
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
        updatedAt: sql`CURRENT_TIMESTAMP`,
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

    return {
      code: 200,
      err: "",
      data: rankings,
    };
  }

  async getScores({
    address,
    gameId,
    limit = 10,
    startTime,
    endTime,
  }: {
    address?: string;
    gameId?: number;
    limit?: number;
    startTime?: string | number;
    endTime?: string | number;
  }) {
    const filters: SQL[] = [];
  
    if (address) {
      filters.push(eq(account.address, address));
    }
  
    if (gameId) {
      filters.push(eq(score.gameId, gameId));
    }
  
    if (startTime) {
      let startDate: string;
      try {
        const date = new Date(startTime);
        if (isNaN(date.getTime())) {
          const timestamp = parseInt(startTime.toString());
          if (isNaN(timestamp)) {
            throw new Error("Invalid date format");
          }
          startDate = new Date(timestamp).toISOString();
        } else {
          startDate = date.toISOString();
        }
        filters.push(sql`${score.updatedAt} >= ${startDate}`);
      } catch (error) {
        throw new Error("Invalid startTime format");
      }
    }
  
    if (endTime) {
      let endDate: string;
      try {
        const date = new Date(endTime);
        if (isNaN(date.getTime())) {
          const timestamp = parseInt(endTime.toString());
          if (isNaN(timestamp)) {
            throw new Error("Invalid date format");
          }
          endDate = new Date(timestamp).toISOString();
        } else {
          endDate = date.toISOString();
        }
        filters.push(sql`${score.updatedAt} <= ${endDate}`);
      } catch (error) {
        throw new Error("Invalid endTime format");
      }
    }
  
    const [result, total] = await Promise.all([
      this.fastify.db
        .select({
          address: account.address,
          quantity: score.score,
          propName: scoreName.name,
          propId: scoreName.id,
          url: game.url,  // 添加 url 字段
        })
        .from(account)
        .leftJoin(score, eq(score.accountId, account.id))
        .leftJoin(scoreName, eq(score.gameId, scoreName.gameId))
        .leftJoin(game, eq(score.gameId, game.id))  // 添加 game 表的 JOIN
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(score.updatedAt))
        .limit(limit),
    
      this.fastify.db
        .select({
          count: sql<number>`count(*)`
        })
        .from(account)
        .leftJoin(score, eq(score.accountId, account.id))
        .where(filters.length > 0 ? and(...filters) : undefined)
    ]);
  
    return {
      code: 200,
      err: "",
      data: result,
      total: total[0].count
    };
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
        scoreName: scoreName.name,
      })
      .from(score)
      .where(eq(score.accountId, accountId))
      .leftJoin(account, eq(score.accountId, account.id))
      .leftJoin(game, eq(score.gameId, game.id))
      .orderBy(desc(score.createdAt))
      .leftJoin(scoreName, eq(score.gameId, scoreName.id));

    return result;
  }

  async getScoresByAddressAndGame(
    address: string,
    gameId: number | string,
    reply: FastifyReply
  ) {
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
      .where(
        and(eq(score.accountId, accountId), eq(score.gameId, Number(gameId)))
      )
      .leftJoin(account, eq(score.accountId, account.id))
      .leftJoin(game, eq(score.gameId, game.id))
      .orderBy(desc(score.createdAt));

    return result;
  }

  async updateScoreByAddress(
    address: string,
    gameId: number,
    newScore: number,
    reply: FastifyReply
  ) {
    // First check if game exists
    const gameResult = await this.fastify.db
      .select()
      .from(game)
      .where(eq(game.id, gameId));

    if (!gameResult.length) {
      reply.code(404);
      throw new Error(`Game with id ${gameId} not found`);
    }

    // Then find the account by address
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
      .where(and(eq(score.accountId, accountId), eq(score.gameId, gameId)));

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
        .set({
          score: newScore,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
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

  // 获取指定数量的排名
  async getRankings(
    gameId: number | string,
    propId: number,
    reply: FastifyReply,
    rank: number = 10000,
    startTime?: string,
    endTime?: string
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

    // 构建查询条件
    let query = this.fastify.db
      .select({
        address: account.address,
        quantity: score.score,
        propId: sql<number>`${propId}`,
        propName: sql<string>`${scoreName.name}`,
      })
      .from(score)
      .leftJoin(account, eq(score.accountId, account.id))
      .leftJoin(scoreName, eq(score.gameId, scoreName.gameId))
      .where(
        and(
          eq(score.gameId, parseInt(gameId.toString())),
          ...(startTime
            ? [
                (() => {
                  let startDate: string;
                  try {
                    const date = new Date(startTime);
                    if (isNaN(date.getTime())) {
                      const timestamp = parseInt(startTime.toString());
                      if (isNaN(timestamp)) {
                        throw new Error("Invalid date format");
                      }
                      startDate = new Date(timestamp).toISOString();
                    } else {
                      startDate = date.toISOString();
                    }
                    return sql`${score.updatedAt} >= ${startDate}`;
                  } catch (error) {
                    throw new Error("Invalid startTime format");
                  }
                })(),
              ]
            : []),
          ...(endTime
            ? [
                (() => {
                  let endDate: string;
                  try {
                    const date = new Date(endTime);
                    if (isNaN(date.getTime())) {
                      const timestamp = parseInt(endTime.toString());
                      if (isNaN(timestamp)) {
                        throw new Error("Invalid date format");
                      }
                      endDate = new Date(timestamp).toISOString();
                    } else {
                      endDate = date.toISOString();
                    }
                    return sql`${score.updatedAt} <= ${endDate}`;
                  } catch (error) {
                    throw new Error("Invalid endTime format");
                  }
                })(),
              ]
            : [])
        )
      );

    // 获取排行榜
    const rankings = await query.orderBy(desc(score.score)).limit(rank);

    return {
      code: 200,
      err: "",
      data: rankings,
    };
  }
}
