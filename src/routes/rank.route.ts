import { FastifyInstance } from "fastify";
import { RankController } from "../controllers/rank.controller";

export async function rankRoutes(fastify: FastifyInstance) {
  const contoller = new RankController(fastify);
  fastify.get(
    "/:address",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              rank: { type: "number" },
              // 距离上一名差多少分，用什么名称比较好
              distanceToNext: { type: "number" },
              address: { type: "string" },
              quantity: { type: "number" },
              propId: { type: "number" },
            },
          },
        },
      },
    },
    contoller.getRank
  );
}
