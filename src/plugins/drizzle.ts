import { drizzle } from 'drizzle-orm/node-postgres';
import { FastifyPluginAsync } from 'fastify';
import { Pool } from "pg";
import { CONFIG } from '../config';
import fp from 'fastify-plugin';

// 数据库连接配置
const connectionString = CONFIG.DATABASE_URL;

// 创建 Drizzle 插件
const drizzlePlugin: FastifyPluginAsync = async (fastify) => {
  console.log(`[Database] Connecting to database in ${CONFIG.NODE_ENV} mode`);
  console.log(`[Database] Connection string: ${connectionString}`);
  
  // 创建 PostgreSQL 客户端
  const pool = new Pool({
    connectionString,
  });
  
  // 初始化 Drizzle
  const db = drizzle(pool);

  // 将 db 实例添加到 Fastify 实例中
  fastify.decorate('db', db);

  // 在服务器关闭时关闭数据库连接
  fastify.addHook('onClose', async () => {
    await pool.end();
  });
};

// 导出插件
export default fp(drizzlePlugin, {
  name: 'drizzle'
});

// 扩展 FastifyInstance 类型
declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle>;
  }
}
