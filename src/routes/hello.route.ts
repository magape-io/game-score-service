import { FastifyInstance } from 'fastify'
import { HelloController } from '../controllers/hello.controller'
import { IParams } from '../types/route.types'

export async function helloRoutes(fastify: FastifyInstance) {
  const controller = new HelloController()

  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' }
          }
        }
      }
    }
  }, controller.getHello)

  fastify.get<{ Params: IParams }>('/hello/:name', {
    schema: {
      params: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, controller.getHelloWithName)
}
