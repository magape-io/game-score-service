import { FastifyInstance, FastifyRequest } from "fastify";
import { sql } from "drizzle-orm";
import { score, account } from "../db/schema";

export class RankController {
  fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  getRank = async (
    request: FastifyRequest<{
      Params: {
        address: string;
      };
    }>
  ) => {
    const { address } = request.params;
    const db = this.fastify.db;

    // 使用单个SQL查询获取所有需要的信息
    const result = await db.execute<{
      rank: number;
      score: number;
      distanceToNext: number;
      prop_id: number;
    }>(sql`
      WITH ranked_scores AS (
        SELECT 
          s.score,
          s.id as prop_id,
          a.address,
          ROW_NUMBER() OVER (ORDER BY s.score DESC) as rank
        FROM ${score} s
        JOIN ${account} a ON s.account_id = a.id
      ),
      user_score AS (
        SELECT *
        FROM ranked_scores
        WHERE address = ${address}
      ),
      next_score AS (
        SELECT score
        FROM ranked_scores
        WHERE score > (SELECT score FROM user_score)
        ORDER BY score ASC
        LIMIT 1
      )
      SELECT 
        us.rank,
        us.score,
        us.prop_id,
        COALESCE((SELECT score FROM next_score) - us.score, 0) as "distanceToNext"
      FROM user_score us
    `);

    if (!result.rows.length) {
      return {
        code: 200,
        err: "",
        data: {
          rank: 0,
          distanceToNext: 0,
          address: address,
          quantity: 0,
          propId: 0,
        },
      };
    }

    const rankData = result.rows[0];

    return {
      code: 200,
      err: "",
      data: {
        rank: rankData.rank,
        distanceToNext: rankData.distanceToNext,
        address: address,
        quantity: rankData.score,
        propId: rankData.prop_id,
      },
    };
  };
}
