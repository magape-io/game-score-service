# 游戏分数服务

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

游戏分数服务，提供分数记录、查询和排行榜功能。

[English](README.md) | [中文](README.zh.md)

</div>

## 功能特点

- ✨ 支持多种时间格式的分数查询
- 📊 支持按游戏ID和钱包地址筛选
- 🏆 支持游戏排行榜
- 🔄 支持分页查询
- 🌐 RESTful API设计

## 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL >= 14

### 安装

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## API 文档

- [游戏分数 API 文档](docs/score-api.zh.md)

## 开发命令

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 生产环境运行
pnpm start

# 数据库迁移
pnpm db:migrate
```

## 技术栈

- Fastify - Web框架
- TypeScript - 开发语言
- PostgreSQL - 数据库
- Drizzle ORM - ORM框架
