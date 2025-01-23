import { FastifyInstance } from "fastify";
import { GameController } from "../controllers/game.controller";

export async function gameRoutes(fastify: FastifyInstance) {
  const controller = new GameController(fastify);

  // Get all games
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    url: { type: "string" },
                    icon: { type: "string" },
                    bannerImages: { type: "string" },
                    status: { type: "number" },
                    type: { type: "string" },
                    platforms: { type: "string" },
                    address: { type: "string" },
                    networkId: { type: ["string", "null"] },
                    briefDescription: { type: "string" },
                    description: { type: "string" },
                    developers: { type: "string" },
                    createBy: { type: "string" },
                    createTime: { type: "number" },
                    updateTime: { type: "number" },
                  },
                },
              },
              err: { type: "string" },
              code: { type: "number" },
            },
          },
        },
      },
    },
    controller.getAllGames
  );

  // Get game by id
  fastify.get(
    "/:id",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  url: { type: "string" },
                  icon: { type: "string" },
                  bannerImages: { type: "string" },
                  status: { type: "number" },
                  type: { type: "string" },
                  platforms: { type: "string" },
                  address: { type: "string" },
                  networkId: { type: ["string", "null"] },
                  briefDescription: { type: "string" },
                  description: { type: "string" },
                  developers: { type: "string" },
                  createBy: { type: "string" },
                  createTime: { type: "number" },
                  updateTime: { type: "number" },
                },
              },
              err: { type: "string" },
              code: { type: "number" },
            },
          },
        },
      },
    },
    controller.getGameById
  );
}
