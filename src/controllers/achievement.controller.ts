import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { achievement, account, achievementType } from "../db/schema";
import { eq, and } from "drizzle-orm";

interface CreateAchievementRequest {
  Body: {
    accountId: number;
    achievementId: number;
    complete: boolean;
  }
}

interface CheckAchievementRequest {
  Body: {
    address: string;
    type: number;
  }
}

interface GetUserAchievementsRequest {
  Params: {
    address: string;
  }
}

export class AchievementController {
  constructor(private fastify: FastifyInstance) {}

  // 获取所有成就类型列表
  async getAllAchievements(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const achievements = await this.fastify.db
        .select()
        .from(achievementType);

      return achievements;
    } catch (error: any) {
      reply.code(500);
      return { error: error.message };
    }
  }

  // 获取用户的成就完成情况列表
  async getUserAchievements(
    request: FastifyRequest<GetUserAchievementsRequest>,
    reply: FastifyReply
  ) {
    try {
      const { address } = request.params;

      // 先查找用户account
      const userAccount = await this.fastify.db
        .select()
        .from(account)
        .where(eq(account.address, address))
        .limit(1);

      if (!userAccount || userAccount.length === 0) {
        reply.code(404);
        return { error: "User not found" };
      }

      const accountId = userAccount[0].id;

      // 获取所有成就类型和用户完成情况
      const userAchievements = await this.fastify.db
        .select({
          id: achievementType.id,
          name: achievementType.name,
          gameId: achievementType.gameId,
          description: achievementType.description,
          complete: achievement.complete,
          completeTime: achievement.completeTime,
        })
        .from(achievementType)
        .leftJoin(
          achievement,
          and(
            eq(achievement.achievementId, achievementType.id),
            eq(achievement.accountId, accountId)
          )
        );

      return userAchievements;
    } catch (error: any) {
      reply.code(500);
      return { error: error.message };
    }
  }

  // 创建用户成就记录
  async createAchievement(
    request: FastifyRequest<CreateAchievementRequest>,
    reply: FastifyReply
  ) {
    try {
      const { accountId, achievementId, complete } = request.body;

      // 使用 upsert 操作：如果记录存在则更新，不存在则创建
      const result = await this.fastify.db
        .insert(achievement)
        .values({
          accountId,
          achievementId,
          complete,
          completeTime: complete ? new Date().toISOString() : null,
        })
        .onConflictDoUpdate({
          target: [achievement.accountId, achievement.achievementId],
          set: {
            complete,
            completeTime: complete ? new Date().toISOString() : null,
          },
        })
        .returning();

      return result[0];
    } catch (error: any) {
      reply.code(500);
      throw error;
    }
  }

  // 查询用户成就完成情况
  async checkAchievement(
    request: FastifyRequest<CheckAchievementRequest>,
    reply: FastifyReply
  ) {
    try {
      const { address, type } = request.body;

      // 先查询account
      const accountResult = await this.fastify.db
        .select()
        .from(account)
        .where(eq(account.address, address));

      // 如果没找到账户，返回未完成
      if (accountResult.length === 0) {
        return {
          code: 200,
          err: "",
          data: false
        };
      }

      const accountId = accountResult[0].id;

      // 查询成就状态
      const result = await this.fastify.db
        .select()
        .from(achievement)
        .where(
          and(
            eq(achievement.accountId, accountId),
            eq(achievement.achievementId, type)
          )
        );

      // 如果没找到成就记录，返回未完成
      if (result.length === 0) {
        return {
          code: 200,
          err: "",
          data: false
        };
      }

      // 返回成就完成状态
      return {
        code: 200,
        err: "",
        data: result[0].complete
      };
    } catch (error: any) {
      return {
        code: 500,
        err: error.message || "Internal server error",
        data: false
      };
    }
  }
}
