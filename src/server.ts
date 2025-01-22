import 'dotenv/config';
import fastify from 'fastify'
import cors from '@fastify/cors'
import { helloRoutes } from './routes/hello.route'
import { setupSwagger } from './plugins/swagger'
import { loggerConfig } from './utils/logger'
import { appConfig } from './config/app.config'
import drizzlePlugin from './plugins/drizzle'
import userRoutes from './routes/user.route'
import accountRoutes from './routes/account.route'
import scoreRoutes from './routes/score.route'
import { rankRoutes } from './routes/rank.route';

// 创建 Fastify 实例
const server = fastify({ logger: loggerConfig })

// 注册插件
server.register(cors, { origin: true })
server.register(setupSwagger)
server.register(drizzlePlugin)

// 注册路由
server.register(helloRoutes)
server.register(userRoutes, { prefix: '/users' })
server.register(accountRoutes, { prefix: '/accounts' })
server.register(scoreRoutes, { prefix: '/scores' })
server.register(rankRoutes,{prefix: '/rank'})

// 启动服务器
const start = async (): Promise<void> => {
  try {
    await server.listen(appConfig.server)
    server.log.info('服务器启动成功')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  try {
    await server.close()
    server.log.info('服务器已关闭')
    process.exit(0)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
})

start()
