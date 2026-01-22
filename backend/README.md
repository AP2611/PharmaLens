# PharmaLens Backend

Production-ready medical web application backend built with Node.js, Express.js, TypeScript, Prisma, and MySQL.

## Features

- JWT-based authentication (Register/Login)
- Prescription analysis using Ollama LLM (qwen2.5:1.5b)
- Structured medical guidance generation:
  - Medication schedules
  - Harmful drug combinations
  - Overdose warnings
  - Side effects
  - Food & lifestyle restrictions
  - Safety tips
- Secure prescription storage
- Prescription history tracking

## Tech Stack

- **Backend**: Node.js + Express.js (TypeScript)
- **Database**: MySQL 8 (Docker)
- **ORM**: Prisma
- **Authentication**: JWT
- **LLM**: Ollama (local)

## Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose
- Ollama installed and running locally
- qwen2.5:1.5b model downloaded in Ollama

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Strong secret key for JWT tokens
- `OLLAMA_BASE_URL`: Ollama service URL (default: http://localhost:11434)
- `OLLAMA_MODEL`: Model name (default: qwen2.5:1.5b)

### 3. Start MySQL Database

```bash
docker-compose up -d
```

Wait for MySQL to be ready (check with `docker-compose ps`).

### 4. Set Up Prisma

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

### 5. Verify Ollama is Running

Ensure Ollama is running and the model is available:

```bash
ollama serve
# In another terminal
ollama pull qwen2.5:1.5b
```

### 6. Start the Server

Development mode (with hot reload):

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token"
  }
}
```

### Prescription (Protected - Requires JWT)

#### Analyze Prescription
```
POST /prescription/analyze
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "rawText": "Take Aspirin 100mg twice daily after meals. Metformin 500mg once daily.",
  "uploadedImagePath": "optional/path/to/image.jpg"
}
```

Response:
```json
{
  "message": "Prescription analyzed successfully",
  "data": {
    "id": "uuid",
    "rawText": "...",
    "uploadedImagePath": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "analysis": {
      "medication_schedule": [...],
      "harmful_combinations": [...],
      "overdose_warnings": [...],
      "side_effects": {...},
      "food_interactions": [...],
      "lifestyle_advice": [...],
      "general_tips": [...]
    }
  }
}
```

#### Get Prescription History
```
GET /prescription/history
Authorization: Bearer <jwt-token>
```

### Health Check

```
GET /health
```

## Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── routes/                # API routes
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── middleware/            # Express middleware
│   └── utils/                 # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
├── docker-compose.yml         # MySQL Docker setup
├── .env.example               # Environment variables template
└── package.json
```

## Database Schema

- **User**: User accounts with authentication
- **Prescription**: Stored prescription data
- **AnalysisResult**: LLM analysis results (JSON)

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (e.g., email already exists)
- `500`: Internal Server Error
- `503`: Service Unavailable (e.g., Ollama not running)

## Development

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### TypeScript

The project uses TypeScript with strict mode enabled. Build with:

```bash
npm run build
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use environment-specific database credentials
5. Ensure Ollama service is accessible
6. Run `npm run build` and `npm start`

## Troubleshooting

### Ollama Connection Issues

- Ensure Ollama is running: `ollama serve`
- Check if model is available: `ollama list`
- Verify `OLLAMA_BASE_URL` in `.env`

### Database Connection Issues

- Ensure MySQL container is running: `docker-compose ps`
- Check `DATABASE_URL` in `.env`
- Verify MySQL is ready: `docker-compose logs mysql`

### Migration Issues

- Reset database (WARNING: deletes all data):
  ```bash
  npx prisma migrate reset
  ```

## License

ISC

