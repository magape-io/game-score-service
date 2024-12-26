import { z } from 'zod'

// 验证请求体的 schema
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

export const updateUserSchema = createUserSchema.partial()

// 类型定义
export type CreateUserBody = z.infer<typeof createUserSchema>
export type UpdateUserBody = z.infer<typeof updateUserSchema>
