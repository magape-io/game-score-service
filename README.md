# 🚀 Game Score Service

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

A modern, high-performance web server built with Fastify and TypeScript, featuring PostgreSQL integration, 
environment-based configuration, and comprehensive API documentation.

[Getting Started](#-getting-started) •
[Features](#-features) •
[Documentation](#-documentation) •
[Development](#-development)

</div>

## ✨ Features

### Core Technologies
- 🚄 **Fastify** - Lightning fast web framework
- 📘 **TypeScript** - Type safety and enhanced developer experience
- 🐘 **PostgreSQL + Drizzle ORM** - Robust database integration with type-safe queries
- 🔄 **Environment Management** - Seamless dev/prod configuration switching

### Developer Experience
- 📚 **Swagger/OpenAPI** - Interactive API documentation
- 📊 **Structured Logging** - Comprehensive logging system
- 🧪 **Testing** - Integrated testing with tap
- 🔌 **Hot Reload** - Fast development with nodemon

### Architecture & Security
- 🏗️ **Modular Architecture** - Clean separation of concerns
- 🔒 **Environment-based Config** - Secure configuration management
- 🌐 **CORS Support** - Built-in Cross-Origin Resource Sharing
- 📦 **Dependency Management** - Modern package management with pnpm

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- pnpm (recommended) or npm

### Quick Start 🏃‍♂️

1️⃣ **Clone and Install**
```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
pnpm install
```

2️⃣ **Configure Environment**
```bash
# Set up environment files
cp .env.example .env.development
cp .env.example .env.production
```

3️⃣ **Database Setup**
```bash
# Run migrations
pnpm db:migrate

# (Optional) Explore with Drizzle Studio
pnpm db:studio
```

4️⃣ **Start Development Server**
```bash
pnpm dev
```

## 🛠️ Development

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm start` | Start production server |
| `pnpm build` | Build the project |
| `pnpm test` | Run test suite |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm db:generate` | Generate database migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Drizzle Studio |

### Project Structure 📁

```
src/
├── config/         # ⚙️  Configuration & environment
├── controllers/    # 🎮 Request handlers
├── db/            # 💾 Database schemas & migrations
├── plugins/       # 🔌 Fastify plugins
├── routes/        # 🛣️  Route definitions
├── types/         # 📝 TypeScript types
└── utils/         # 🔧 Utility functions
```

## 📚 Documentation

### Environment Configuration

The project uses environment-specific configuration files:

| File | Purpose |
|------|---------|
| `.env.development` | Local development settings |
| `.env.production` | Production environment settings |

Key configuration variables:
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `HOST`: Server host

### API Documentation

Access the Swagger UI documentation at:
```
http://localhost:3000/documentation
```

## 🧪 Testing

Run the test suite:
```bash
# Single run
pnpm test

# Watch mode
pnpm test:watch
```

## 📦 Dependencies

### Core
- Fastify v4.25
- TypeScript v5.3
- Drizzle ORM v0.38
- PostgreSQL

### Development
- Nodemon (hot reload)
- ts-node (TypeScript execution)
- tap (testing framework)
- drizzle-kit (database tools)

## 📄 License

MIT

---
<div align="center">
Made with ❤️ by [Your Name/Team]
</div>
