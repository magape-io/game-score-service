import { config } from 'dotenv'
import path from 'path'

// 根据 NODE_ENV 加载对应的环境配置文件
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production'
  : '.env.development'

// 加载环境配置
config({ path: path.resolve(process.cwd(), envFile) })

export const CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // 可以添加更多配置项
}

// 类型定义
export type Config = typeof CONFIG
