import { FastifyReply, FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import { CreateUserBody, UpdateUserBody } from '../types/user.types'

export class UserController {
  constructor(private fastify: FastifyInstance) {}

  // 获取所有用户
  async getAllUsers() {
    const allUsers = await this.fastify.db.select().from(users)
    return allUsers
  }

  // 获取单个用户
  async getUserById(id: string, reply: FastifyReply) {
    const user = await this.fastify.db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1)

    if (!user.length) {
      reply.code(404)
      throw new Error('User not found')
    }

    return user[0]
  }

  // 创建用户
  async createUser(userData: CreateUserBody, reply: FastifyReply) {
    const newUser = await this.fastify.db
      .insert(users)
      .values(userData)
      .returning()

    reply.code(201)
    return newUser[0]
  }

  // 更新用户
  async updateUser(id: string, userData: UpdateUserBody, reply: FastifyReply) {
    const updatedUser = await this.fastify.db
      .update(users)
      .set(userData)
      .where(eq(users.id, parseInt(id)))
      .returning()

    if (!updatedUser.length) {
      reply.code(404)
      throw new Error('User not found')
    }

    return updatedUser[0]
  }

  // 删除用户
  async deleteUser(id: string, reply: FastifyReply) {
    const deletedUser = await this.fastify.db
      .delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning()

    if (!deletedUser.length) {
      reply.code(404)
      throw new Error('User not found')
    }

    return deletedUser[0]
  }
}
