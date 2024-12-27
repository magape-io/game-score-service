import { FastifyPluginAsync } from "fastify"
import { ScoreController } from "../controllers/score.controller"

const scoreRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const scoreController = new ScoreController(fastify)
  
  // 获取所有分数记录
  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              score: { type: 'number' },
              gameId: { type: 'number' },
              accountId: { type: 'number' },
              createdAt: { type: 'string' },
              accountAddress: { type: 'string' },
              gameName: { type: 'string' },
            }
          }
        }
      }
    }
  }, async () => {
    return scoreController.getAllScores()
  })

  // 获取单个分数记录
  fastify.get<{
    Params: {
      id: string;
    };
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            score: { type: 'number' },
            gameId: { type: 'number' },
            accountId: { type: 'number' },
            createdAt: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    return scoreController.getScoreById(id, reply)
  })

  // 创建分数记录
  fastify.post<{
    Body: {
      gameId: number;
      accountId: number;
      score: number;
    };
  }>('/', {
    schema: {
      body: {
        type: 'object',
        required: ['gameId', 'accountId', 'score'],
        properties: {
          gameId: { type: 'number', minimum: 1 },
          accountId: { type: 'number', minimum: 1 },
          score: { type: 'number', minimum: 0 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            gameId: { type: 'number' },
            accountId: { type: 'number' },
            score: { type: 'number' },
            createdAt: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { gameId, accountId, score } = request.body
    return scoreController.createScore(accountId, gameId, score, reply)
  })

  // 更新分数记录
  fastify.put<{
    Params: {
      id: string;
    };
    Body: {
      score: number;
    };
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      },
      body: {
        type: 'object',
        required: ['score'],
        properties: {
          score: { type: 'number', minimum: 0 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            gameId: { type: 'number' },
            accountId: { type: 'number' },
            score: { type: 'number' },
            createdAt: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    const { score } = request.body
    return scoreController.updateScore(id, score, reply)
  })

  // 删除分数记录
  fastify.delete<{
    Params: {
      id: string;
    };
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            gameId: { type: 'number' },
            accountId: { type: 'number' },
            score: { type: 'number' },
            createdAt: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    return scoreController.deleteScore(id, reply)
  })

  // 获取游戏排行榜
  fastify.get<{
    Params: {
      gameId: string;
    };
    Querystring: {
      limit?: number;
    };
  }>('/rankings/:gameId', {
    schema: {
      params: {
        type: 'object',
        required: ['gameId'],
        properties: {
          gameId: { type: 'string', pattern: '^\\d+$' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              accountId: { type: 'number' },
              accountAddress: { type: 'string' },
              score: { type: 'number' },
              gameId: { type: 'number' },
              createdAt: { type: 'string' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { gameId } = request.params
    const { limit = 10 } = request.query
    return scoreController.getGameRanking(gameId, limit, reply)
  })
}

export default scoreRoutes
