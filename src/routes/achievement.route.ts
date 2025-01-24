import { FastifyInstance } from "fastify";
import { AchievementController } from "../controllers/achievement.controller";

export async function achievementRoutes(fastify: FastifyInstance) {
  const achievementController = new AchievementController(fastify);

  // 创建用户成就记录
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["accountId", "achievementId", "complete"],
          properties: {
            accountId: { type: "number" },
            achievementId: { type: "number" },
            complete: { type: "boolean" },
          },
        },
      },
    },
    achievementController.createAchievement.bind(achievementController)
  );

  // 查询用户成就完成情况
  fastify.post(
    "/check",
    {
      schema: {
        body: {
          type: "object",
          required: ["address", "achievementId"],
          properties: {
            address: { type: "string" },
            achievementId: { type: "number" },
          },
        },
      },
    },
    achievementController.checkAchievement.bind(achievementController)
  );
}
