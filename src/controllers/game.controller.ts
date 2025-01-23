import { FastifyInstance, FastifyRequest } from "fastify";
import { sql } from "drizzle-orm";
import { game } from "../db/schema";

export class GameController {
  fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  getGameById = async (
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>
  ) => {
    const { id } = request.params;
    const db = this.fastify.db;

    const result = await db
      .select()
      .from(game)
      .where(sql`${game.id} = ${parseInt(id)}`);

    if (!result.length) {
      return {
        code: 404,
        err: "Game not found",
        data: null,
      };
    }

    const gameData = result[0];
    
    return {
      code: 200,
      err: "",
      data: {
        id: gameData.id,
        name: gameData.name,
        url: gameData.url,
        icon: gameData.icon,
        bannerImages: gameData.bannerImages,
        status: gameData.status,
        type: gameData.type,
        platforms: gameData.platforms,
        address: gameData.address,
        networkId: gameData.networkId,
        briefDescription: gameData.briefDescription,
        description: gameData.description,
        developers: gameData.developers,
        createBy: gameData.createBy,
        createTime: new Date(gameData.createdAt).getTime(),
        updateTime: new Date(gameData.updatedAt).getTime(),
      },
    };
  };

  getAllGames = async () => {
    const db = this.fastify.db;

    const result = await db
      .select()
      .from(game)
      .orderBy(sql`${game.createdAt} DESC`);

    return {
      code: 200,
      err: "",
      data: result.map(gameData => ({
        id: gameData.id,
        name: gameData.name,
        url: gameData.url,
        icon: gameData.icon,
        bannerImages: gameData.bannerImages,
        status: gameData.status,
        type: gameData.type,
        platforms: gameData.platforms,
        address: gameData.address,
        networkId: gameData.networkId,
        briefDescription: gameData.briefDescription,
        description: gameData.description,
        developers: gameData.developers,
        createBy: gameData.createBy,
        createTime: new Date(gameData.createdAt).getTime(),
        updateTime: new Date(gameData.updatedAt).getTime(),
      })),
    };
  };
}
