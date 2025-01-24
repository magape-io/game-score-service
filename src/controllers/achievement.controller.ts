import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { achievement, account } from "../db/schema";
import { eq, and } from "drizzle-orm";

interface CreateAchievementRequest {
  Body: {
    accountId: number;
    achievementId: number;
    complete: boolean;
  }
}

interface CheckAchievementRequest {
  Params: {
    address: string;
    achievementId: string;
  }
}

export class AchievementController {
  constructor(private fastify: FastifyInstance) {}

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
      const { address, achievementId } = request.params;

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
            eq(achievement.achievementId, parseInt(achievementId))
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
