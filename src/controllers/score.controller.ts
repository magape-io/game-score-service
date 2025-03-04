import { FastifyInstance, FastifyReply } from "fastify";
import { score, game, account, scoreName } from "../db/schema";
import { eq, desc, and, SQL, sql, gte, lte } from "drizzle-orm";
import { createObjectCsvWriter } from 'csv-writer';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import { readFileSync, readdirSync, statSync } from 'fs';

export class ScoreController {
  constructor(private fastify: FastifyInstance) {}

  // 将东八区时间转换为UTC时间戳
  private convertToUTCTimestamp(localTime: string | number): number {
    try {
      if (typeof localTime === 'number') {
        return localTime;
      }
      // 假设输入的是东八区的时间
      const date = new Date(localTime);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      // 东八区偏移量是 +8 小时，所以需要减去 8 小时得到 UTC 时间
      return date.getTime() - (8 * 60 * 60 * 1000);
    } catch (error) {
      throw new Error("Invalid time format");
    }
  }

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
      try {
        const utcTimestamp = this.convertToUTCTimestamp(startTime);
        filters.push(sql`${score.updatedAt} >= ${new Date(utcTimestamp).toISOString()}`);
      } catch (error) {
        throw new Error("Invalid startTime format");
      }
    }
  
    if (endTime) {
      try {
        const utcTimestamp = this.convertToUTCTimestamp(endTime);
        filters.push(sql`${score.updatedAt} <= ${new Date(utcTimestamp).toISOString()}`);
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
    console.log('getRankings received rank:', rank, 'type:', typeof rank);
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
                  try {
                    const utcTimestamp = this.convertToUTCTimestamp(startTime);
                    return sql`${score.updatedAt} >= ${new Date(utcTimestamp).toISOString()}`;
                  } catch (error) {
                    throw new Error("Invalid startTime format");
                  }
                })(),
              ]
            : []),
          ...(endTime
            ? [
                (() => {
                  try {
                    const utcTimestamp = this.convertToUTCTimestamp(endTime);
                    return sql`${score.updatedAt} <= ${new Date(utcTimestamp).toISOString()}`;
                  } catch (error) {
                    throw new Error("Invalid endTime format");
                  }
                })(),
              ]
            : [])
        )
      );
      console.log('rank is',rank);
    // 获取排行榜
    const rankings = await query.orderBy(desc(score.score)).limit(rank);

    return {
      code: 200,
      err: "",
      data: rankings,
    };
  }

  // 从备份文件恢复数据
  async restoreScores(backupFile: string, reply: FastifyReply) {
    try {
      const backupPath = join(process.cwd(), 'backups', backupFile);
      const fileContent = readFileSync(backupPath, 'utf-8');
      
      // 解析CSV文件
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      });

      // 开始批量恢复数据
      const results = await this.fastify.db.transaction(async (tx) => {
        // 先清空当前数据
        await tx.delete(score);

        // 批量插入备份数据
        const insertPromises = records.map((record:any) => {
          return tx.insert(score).values({
            id: parseInt(record.ID),
            score: parseInt(record.Score), 
            gameId: parseInt(record['Game ID']),
            accountId: parseInt(record['Account ID']),
            createdAt: new Date(record['Created At']).toISOString(), 
            updatedAt: new Date(record['Updated At']).toISOString()  
          });
        });

        return Promise.all(insertPromises);
      });

      return {
        message: 'Scores have been restored successfully',
        restoredCount: results.length
      };
    } catch (error) {
      reply.code(500);
      throw new Error(`Failed to restore scores: `);
    }
  }

  // 重置所有分数并备份数据
  async resetAllScores(reply: FastifyReply) {
    try {
      // 1. 获取所有现有分数数据
      const existingScores = await this.fastify.db
        .select({
          id: score.id,
          score: score.score,
          gameId: score.gameId,
          accountId: score.accountId,
          createdAt: score.createdAt,
          updatedAt: score.updatedAt,
          accountAddress: account.address,
          gameName: game.name,
        })
        .from(score)
        .leftJoin(account, eq(score.accountId, account.id))
        .leftJoin(game, eq(score.gameId, game.id));

      // 2. 导出数据到CSV
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = join(process.cwd(), 'backups');
      const csvWriter = createObjectCsvWriter({
        path: join(backupDir, `score_backup_${timestamp}.csv`),
        header: [
          { id: 'id', title: 'ID' },
          { id: 'score', title: 'Score' },
          { id: 'gameId', title: 'Game ID' },
          { id: 'accountId', title: 'Account ID' },
          { id: 'accountAddress', title: 'Account Address' },
          { id: 'gameName', title: 'Game Name' },
          { id: 'createdAt', title: 'Created At' },
          { id: 'updatedAt', title: 'Updated At' },
        ],
      });
      
      await csvWriter.writeRecords(existingScores);

      // 3. 重置所有分数
      await this.fastify.db
        .update(score)
        .set({
          score: 0,
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString()  
        });

      return {
        code: 200,
        data: "success",
        err: ''
      };
    } catch (error) {
      reply.code(500);
      throw new Error(`Failed to reset scores: `);
    }
  }

  // 获取备份文件列表
  async getBackupFiles() {
    try {
      const backupDir = join(process.cwd(), 'backups');
      const files = readdirSync(backupDir)
        .filter(file => file.endsWith('.csv'))
        .map(file => {
          const filePath = join(backupDir, file);
          const stats = statSync(filePath);
          return {
            fileName: file,
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
            modifiedAt: stats.mtime.toISOString()
          };
        })
        .sort((a, b) => b.fileName.localeCompare(a.fileName)); // 按文件名倒序，最新的在前面

      return {
        message: 'Backup files retrieved successfully',
        files
      };
    } catch (error) {
      throw new Error(`Failed to get backup files`);
    }
  }
}
