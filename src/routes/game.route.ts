import { FastifyPluginAsync } from "fastify";
import { GameController } from "../controllers/game.controller";

const gameRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const gameController = new GameController(fastify);

  // 获取游戏列表
  fastify.get("/games", {}, async (request, reply) => {
    return gameController.getAllGames();
  });

  // 根据ID获取游戏详情
  fastify.get<{
    Params: {
      id: string;
    };
  }>(
    "/games/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", pattern: "^\\d+$" },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      return gameController.getGameById(id, reply);
    }
  );
};

export default gameRoutes;
