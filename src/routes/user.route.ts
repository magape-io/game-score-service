import { FastifyPluginAsync } from 'fastify'
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import { z } from 'zod'

// 验证请求体的 schema
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

const updateUserSchema = createUserSchema.partial()

const userRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // 获取所有用户
  fastify.get('/', async () => {
    const allUsers = await fastify.db.select().from(users)
    return allUsers
  })

  // 获取单个用户
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const user = await fastify.db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1)

    if (!user.length) {
      reply.code(404)
      throw new Error('User not found')
    }

    return user[0]
  })

  // 创建用户
  fastify.post('/', async (request, reply) => {
    const body = createUserSchema.parse(request.body)
    
    const newUser = await fastify.db
      .insert(users)
      .values(body)
      .returning()

    reply.code(201)
    return newUser[0]
  })

  // 更新用户
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = updateUserSchema.parse(request.body)

    const updatedUser = await fastify.db
      .update(users)
      .set(body)
      .where(eq(users.id, parseInt(id)))
      .returning()

    if (!updatedUser.length) {
      reply.code(404)
      throw new Error('User not found')
    }

    return updatedUser[0]
  })

  // 删除用户
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    
    const deletedUser = await fastify.db
      .delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning()

    if (!deletedUser.length) {
      reply.code(404)
      throw new Error('User not found')
    }

    reply.code(204)
  })
}

export default userRoutes
