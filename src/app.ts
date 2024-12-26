import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { helloRoutes } from './routes/hello.route'
import { setupSwagger } from './plugins/swagger'
import { loggerConfig } from './utils/logger'
import accountRoutes from './routes/account.route'
import drizzlePlugin from './plugins/drizzle'
import userRoutes from './routes/user.route'

export async function build(): Promise<FastifyInstance> {
  const app = fastify({ logger: loggerConfig })

  // Register plugins
  await app.register(cors)
  await app.register(drizzlePlugin)
  await setupSwagger(app)

  // Register routes
  app.register(helloRoutes)
  app.register(userRoutes)
  app.register(accountRoutes)

  return app
}
