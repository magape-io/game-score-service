export const appConfig: {
  server: {
    port: number;
    host: string;
  };
  logger: {
    level: string;
    file: string;
  };
  swagger: {
    routePrefix: string;
    swagger: {
      info: {
        title: string;
        description: string;
        version: string;
      };
      host: string;
      schemes: string[];
      consumes: string[];
      produces: string[];
    };
  };
} = {
  server: {
    port: 4000,
    host: '0.0.0.0'
  },
  logger: {
    level: 'info',
    file: 'logs/server.log'
  },
  swagger: {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Fastify API',
        description: 'Testing the Fastify swagger API',
        version: '0.1.0'
      },
      host: 'localhost:4000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    }
  }
}
