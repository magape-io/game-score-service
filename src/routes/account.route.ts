import { FastifyPluginAsync } from "fastify"
import { AccountController } from "../controllers/account.controller"

const accountRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const accountController = new AccountController(fastify)
  
  // 获取所有账户
  fastify.get('/', {}, async () => {
    return accountController.getAllAccount()
  })
  
  // 获取单个账户
  fastify.get<{
    Params: {
      id: string;
    };
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    return accountController.getAccountById(id, reply)
  })
  
  // 创建账户
  fastify.post<{
    Body: {
      address: string;
    };
  }>('/', {
    schema: {
      body: {
        type: 'object',
        required: ['address'],
        properties: {
          address: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { address } = request.body
    return accountController.createAccount(address)
  })

  // 更新账户
  fastify.put<{
    Params: {
      id: string;
    };
    Body: {
      address: string;
    };
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      },
      body: {
        type: 'object',
        required: ['address'],
        properties: {
          address: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    const { address } = request.body
    return accountController.updateAccount(id, address, reply)
  })

  // 删除账户
  fastify.delete<{
    Params: {
      id: string;
    };
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    return accountController.deleteAccount(id, reply)
  })

}

export default accountRoutes