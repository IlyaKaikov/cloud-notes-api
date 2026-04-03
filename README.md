# Cloud Notes API

A backend REST API for a cloud notes application, built with Node.js, TypeScript, Express, and PostgreSQL.

This project was built as a portfolio project to practice backend engineering fundamentals: API design, database integration, validation, testing, Docker, migrations, and deployment.

## Features

- CRUD operations for notes
- Pagination, search, and sorting for note listing
- Full update with `PUT`
- Partial update with `PATCH`
- Input validation
- Centralized error handling
- PostgreSQL integration
- SQL migration workflow
- Automated tests
- Dockerized local development and deployment-ready setup

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- pg
- Vitest
- Supertest
- Docker
- Render

## API Endpoints

### Health
- `GET /` - Basic app status
- `GET /api/v1/health` - Health check

### Notes
- `GET /api/v1/notes` - Get notes with pagination / search / sorting
- `GET /api/v1/notes/:id` - Get a single note
- `POST /api/v1/notes` - Create a note
- `PUT /api/v1/notes/:id` - Replace a note
- `PATCH /api/v1/notes/:id` - Partially update a note
- `DELETE /api/v1/notes/:id` - Delete a note

## Query Parameters for `GET /api/v1/notes`

- `page` - Page number
- `limit` - Items per page
- `search` - Search in title/content
- `sortBy` - `created_at`, `updated_at`, or `title`
- `order` - `asc` or `desc`
