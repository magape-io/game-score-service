import { FastifyPluginAsync } from 'fastify'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { UserController } from '../controllers/user.controller'
import { createUserSchema, updateUserSchema, CreateUserBody, UpdateUserBody } from '../types/user.types'

const userRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const userController = new UserController(fastify)

  // 获取所有用户
  fastify.get('/', {}, async () => {
    return userController.getAllUsers()
  })

  // 获取单个用户
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
    return userController.getUserById(id, reply)
  })

  // 创建用户
  fastify.post<{
    Body: CreateUserBody;
  }>('/', {
    schema: {
      body: zodToJsonSchema(createUserSchema)
    }
  }, async (request, reply) => {
    return userController.createUser(request.body, reply)
  })

  // 更新用户
  fastify.put<{
    Params: {
      id: string;
    };
    Body: UpdateUserBody;
  }>('/:id', {
    schema: {
      body: zodToJsonSchema(updateUserSchema),
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^\\d+$' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    return userController.updateUser(id, request.body, reply)
  })

  // 删除用户
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
    return userController.deleteUser(id, reply)
  })
}

export default userRoutes
