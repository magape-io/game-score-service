import { FastifyInstance } from "fastify";
import { AchievementController } from "../controllers/achievement.controller";

export async function achievementRoutes(fastify: FastifyInstance) {
  const achievementController = new AchievementController(fastify);

  // 获取所有成就类型列表
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              err: { type: "string" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    gameId: { type: "number" },
                    description: { type: "string" },
                  },
                },
              }
            }
          },
          500: {
            type: "object",
            properties: {
              code: { type: "number" },
              err: { type: "string" },
              data: { 
                type: "array",
                items: { type: "object" }
              }
            },
            description: "Internal server error",
          },
        },
      },
    },
    achievementController.getAllAchievements.bind(achievementController)
  );

  // 获取用户的成就完成情况列表
  fastify.get(
    "/user",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            address: { 
              type: "string",
              description: "User's blockchain address"
            },
            gameId: {
              type: "string",
              description: "Optional game ID to filter achievements",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              err: { type: "string" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number", description: "Achievement type ID" },
                    name: { type: "string", description: "Achievement name" },
                    gameId: { type: "number", description: "Associated game ID" },
                    description: { type: "string", description: "Achievement description" },
                    complete: { 
                      type: "boolean", 
                      nullable: true,
                      description: "Whether the user has completed this achievement"
                    },
                    completeTime: { 
                      type: "string", 
                      nullable: true,
                      description: "Timestamp when the achievement was completed"
                    },
                  },
                },
              }
            }
          },
          404: {
            type: "object",
            properties: {
              code: { type: "number" },
              err: { type: "string" },
              data: { 
                type: "array",
                items: { type: "object" }
              }
            },
            description: "User not found",
          },
          500: {
            type: "object",
            properties: {
              code: { type: "number" },
              err: { type: "string" },
              data: { 
                type: "array",
                items: { type: "object" }
              }
            },
            description: "Internal server error",
          },
        },
      },
    },
    achievementController.getUserAchievements.bind(achievementController)
  );

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
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              err: { type: "string" },
              data: { 
                type: "array",
                items: { type: "object" }
              }
            }
          },
          500: {
            type: "object",
            properties: {
              code: { type: "number" },
              err: { type: "string" },
              data: { 
                type: "array",
                items: { type: "object" }
              }
            },
            description: "Internal server error",
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
          required: ["address", "type"],
          properties: {
            address: { type: "string" },
            type: { type: "number" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              err: { type: "string" },
              data: { 
                type: "array",
                items: { type: "object" }
              }
            }
          },
          500: {
            type: "object",
            properties: {
              code: { type: "number" },
              err: { type: "string" },
              data: { 
                type: "array",
                items: { type: "object" }
              }
            },
            description: "Internal server error",
          },
        },
      },
    },
    achievementController.checkAchievement.bind(achievementController)
  );
}
