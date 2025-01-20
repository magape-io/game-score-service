# Game Score Service

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

Game score service that provides score recording, querying, and leaderboard functionality.

</div>

## Features

- ✨ Score queries with multiple time format support
- 📊 Filter by game ID and wallet address
- 🏆 Game leaderboard support
- 🔄 Pagination support
- 🌐 RESTful API design

## Quick Start

### Requirements

- Node.js >= 18
- PostgreSQL >= 14

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## API Documentation

- [Game Score API Documentation](docs/score-api.zh.md)

## Development Commands

```bash
# Development mode
pnpm dev

# Build
pnpm build

# Production mode
pnpm start

# Database migration
pnpm db:migrate
```

## Tech Stack

- Fastify - Web framework
- TypeScript - Programming language
- PostgreSQL - Database
- Drizzle ORM - ORM framework