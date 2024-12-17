import { FastifyInstance } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { appConfig } from '../config/app.config'

export async function setupSwagger(server: FastifyInstance) {
  await server.register(swagger, appConfig.swagger)
  await server.register(swaggerUI, {
    routePrefix: appConfig.swagger.routePrefix
  })
}
