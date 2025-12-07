# AI Agentic RAG NestJS Project

This project is a NestJS-based backend for an AI Agentic RAG (Retrieval-Augmented Generation) system. It utilizes LangChain, OpenAI/Groq for LLM processing, and PostgreSQL with `pgvector` for vector storage.

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Docker](https://www.docker.com/) & Docker Compose (required for the database and Redis)

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd ai-agentic-rag-nestjs
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Environment Setup

1.  Copy the example environment file:
    ```bash
    cp .env-example .env
    ```

2.  Update the `.env` file with your specific configuration. Below is a list of required environment variables:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | The port the application will run on | `3000` |
| `CHAT_MODEL_TYPE` | The LLM provider to use | `openai` or `groq` |
| `GROQ_API_KEY` | API key for Groq (required if using Groq) | `gsk_...` |
| `GROQ_CHAT_MODEL` | Specific model for Groq | `llama3-8b-8192` |
| `DATABASE_HOST` | Postgres host | `localhost` |
| `DATABASE_PORT` | Postgres port | `5432` |
| `DATABASE_NAME` | Database name | `ai_agents` |
| `DATABASE_USERNAME` | Postgres username | `postgres` |
| `DATABASE_PASSWORD` | Postgres password | `postgres` |
| `DATABASE_SYNCHRONIZE`| Sync DB schema (dev only) | `true` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PREFIX` | Optional prefix for Redis keys | `myapp` |
| `TAVILY_API_KEY` | API Key for Tavily Search Tool | `tvly-...` |

> **Note:** Only populate API keys for the services you intend to use.

## Database & Infrastructure Setup

This project uses **PostgreSQL** with the **`pgvector`** extension for vector embeddings and **Redis** for caching/queues. The easiest way to run these is via Docker Compose.

### Start Infrastructure (Postgres + Redis)

To start only the database and Redis services for local development:

```bash
docker-compose up -d postgres redis
```

This will spin up:
-   **Postgres** on port `5432` (db: `ai_agents`, user: `postgres`, pass: `postgres`)
-   **Redis** on port `6379`

### Run with Docker

To run the entire application (including the API) in Docker:

```bash
docker-compose up --build
```

## Database Migrations

This project uses TypeORM for database migrations.

> **Important:** Ensure the database is running before executing migrations.

1.  **Build the project** (Required for migrations to detect entities and datasource):
    ```bash
    npm run build
    ```

2.  **Generate a new migration** (after making schema changes):
    ```bash
    npm run migration:generate --name=<MigrationName>
    ```

3.  **Run pending migrations**:
    ```bash
    npm run migration:up
    ```

4.  **Revert the last migration**:
    ```bash
    npx typeorm migration:revert --d ./dist/database/typeorm/typeorm-migration.datasource.js
    ```

## Running the Application

Once the database is up and migrations are run, you can start the application.

### Development Mode
data
```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
