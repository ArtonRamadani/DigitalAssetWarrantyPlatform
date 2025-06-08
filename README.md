# Digital Asset Warranty Platform

A full-stack TypeScript application for managing digital assets and simulating warranty quotes.

## Tech Stack

- Frontend: ReactJS + TypeScript + Vite
- Backend: NodeJS + Express + TypeScript
- ORM: Prisma
- Database: PostgreSQL
- API Client: Axios
- API Documentation: Swagger UI

## Project Structure

- frontend/          # React frontend application
- backend/           # Node.js backend application
- README.md          # Documentation

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
cd backend

2. Install dependencies:
npm install


3. Create a `.env` file with the following variables:

DATABASE_URL="postgresql://postgres:root@localhost:5432/digital_assets?schema=public"
PORT=8000

4. Initialize Prisma:
npx prisma generate
npx prisma migrate dev
npm run dev

7. Access API documentation at:
http://localhost:8000/api-docs

### Frontend Setup

1. Navigate to frontend directory:
cd frontend
npm install
npm run dev

### API Endpoints
1. **Digital Assets Management**
   - `GET /api/assets` - List all digital assets
   - `POST /api/assets` - Create a new digital asset
   - `GET /api/assets/:id/quote` - Get warranty quote for an asset

### Asset Categories and Warranty Rates
- Electronics (2% of value)
- Watches (3% of value)
- Collectibles (4% of value)
- Other (5% of value)

### Detailed API Documentation

For complete API documentation with request/response examples, visit:
```
http://localhost:8000/api-docs
```

This documentation includes:
- Request/response schemas
- Example requests and responses
- Error handling information
- Authentication requirements (if any)

### Asset Categories
- Electronics (2% of value)
- Watches (3% of value)
- Collectibles (4% of value)
- Other (5% of value)

## Development

The application is built with TypeScript for type safety and follows a modular architecture. Both frontend and backend are configured with hot-reload for development convenience.