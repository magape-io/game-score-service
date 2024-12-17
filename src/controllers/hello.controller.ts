import { FastifyReply, FastifyRequest } from 'fastify'
import { IParams } from '../types/route.types'

export class HelloController {
  async getHello(_request: FastifyRequest, _reply: FastifyReply) {
    return { hello: 'world' }
  }

  async getHelloWithName(request: FastifyRequest<{ Params: IParams }>, _reply: FastifyReply) {
    const { name } = request.params
    return { message: `Hello ${name}!` }
  }
}
