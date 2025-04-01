# Smart Notice Board

A full-stack college notice management system that centralizes the creation, delivery, and management of institutional announcements. Built for schools, colleges, and organizations that need a structured, role-based communication layer between administrators and students.

Live: [hack-a-sprint-subps.vercel.app](https://hack-a-sprint-subps.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Deployment](#deployment)

---

## Overview

Smart Notice Board replaces physical notice boards and fragmented email chains with a single, structured platform. Admins can publish, pin, and categorize notices. Students get a clean feed of relevant announcements. The system supports PDF uploads, notice import/export, full-text search, and role-based access control out of the box.

**Live Routes**

<<<<<<< HEAD
| Role    | URL                                                              |
|---------|------------------------------------------------------------------|
| Public  | https://hack-a-sprint-subps.vercel.app                          |
| Login   | https://hack-a-sprint-subps.vercel.app/login                    |
| Admin   | https://hack-a-sprint-subps.vercel.app/admin/dashboard          |
| Student | https://hack-a-sprint-subps.vercel.app/student/feed             |
=======
| Role    | URL                                                    |
| ------- | ------------------------------------------------------ |
| Public  | https://hack-a-sprint-subps.vercel.app                 |
| Login   | https://hack-a-sprint-subps.vercel.app/login           |
| Admin   | https://hack-a-sprint-subps.vercel.app/admin/dashboard |
| Student | https://hack-a-sprint-subps.vercel.app/student/feed    |
>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8

---

## Features

**Admin**
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- Create, edit, and delete notices
- Pin and unpin priority notices
- Upload notice attachments as PDFs via Cloudinary
- Bulk import and export notices
- Search and filter the full notice registry

**Student**
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- Personalized notice feed
- View pinned and recent announcements
- Search and filter by category or date

**System**
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- JWT-based authentication with bcrypt password hashing
- Role-based route protection (admin vs. student)
- Rate limiting on sensitive endpoints via Upstash Redis
- Server-side rendering for fast initial page loads
- Optimistic UI updates backed by React Query caching

---

## Tech Stack

### Frontend
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- **Next.js 16** - Full-stack framework (SSR, routing, Server Components, API routes)
- **Tailwind CSS 4** - Utility-first styling

### State Management and Data Fetching
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- **Zustand** - Lightweight global client state
- **TanStack React Query** - Server state management, caching, and background refetching

### Backend
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- **Next.js API Routes / Server Actions** - Backend logic colocated with the frontend
- **Node.js** - Runtime environment

### Database and ORM
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- **PostgreSQL** - Primary relational database
- **Prisma** - Type-safe ORM for schema modeling, migrations, and queries

### Authentication and Security
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- **jsonwebtoken (JWT)** - Stateless auth tokens
- **bcryptjs** - Password hashing

### Cloud and External Services
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- **Cloudinary** - PDF and image upload, storage, and delivery
- **Firebase + Firebase Admin** - Additional backend services
- **Upstash Redis** - Session caching and API rate limiting

### Validation and Utilities
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- **Zod** - Runtime schema validation for all API inputs
- **Axios** - HTTP client for client-side requests

### Developer Tooling
<<<<<<< HEAD
=======

>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8
- **TypeScript** - Static type checking across the entire codebase
- **ESLint + eslint-config-next** - Linting and code quality
- **Prisma CLI** - Database migrations and schema management
- **PostCSS** - Tailwind CSS build pipeline
- **dotenv** - Environment variable management

---

## Architecture

```
Client Layer (Next.js 16)
    |
    |-- App Router (Pages & Layouts)
    |-- React Query (server state + caching)
    |-- Zustand (global state)
    |-- Client Modules (auth, notice, home)
    |
    |-- UI Components (forms, cards, navbar, sidebar)
    |
────────────────────────────────────────────

Next.js Server Layer
    |
    |-- Server Components (SSR / RSC)
    |-- API Routes (/api/v1/*)
    |-- Middleware (auth, request handling)
    |
    |-- Input Validation (Zod)
    |-- Authentication (JWT + bcrypt)
    |-- Rate Limiting & Cache (Upstash Redis)
    |
────────────────────────────────────────────

Backend Modular Layer (Clean Architecture)
    |
    |-- Controllers (handle request/response)
    |-- Services (business logic)
    |-- Repositories (DB queries)
    |-- Validators (Zod schemas)
    |
    |-- Modules:
    |     |-- Auth
    |     |-- User
    |     |-- Notice
    |     |-- Bookmark
    |     |-- Subscription
    |     |-- Dashboard
    |     |-- Upload
    |
────────────────────────────────────────────

Data Layer
    |
    |-- Prisma ORM
    |       |
    |    PostgreSQL Database
    |
────────────────────────────────────────────

External Services Layer
    |
    |-- Cloudinary (file/image storage)
    |-- Firebase (client SDK)
    |-- Firebase Admin (server-side services, FCM)
    |
────────────────────────────────────────────

Infrastructure / Utilities Layer
    |
    |-- Axios (API communication)
    |-- Redis (Upstash)
    |-- Env Config (dotenv)
    |-- Error Handling & Helpers
```

The application follows a layered architecture. All API inputs are validated with Zod before reaching business logic. Authentication is handled with JWTs verified server-side on protected routes. Rate-sensitive endpoints are gated by Upstash Redis before any database interaction occurs.

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL instance (local or hosted)
- Accounts for Cloudinary, Firebase, and Upstash

### Installation

```bash
git clone https://github.com/your-username/hack-a-sprint.git
cd hack-a-sprint

bun install
```

### Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the project root. All variables are required unless marked optional.

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## Database Setup

Run Prisma migrations to create the schema:

```bash
bunx prisma migrate dev --name init
```

To open Prisma Studio for a visual look at your data:

```bash
bunx prisma studio
```

To reset the database during development:

```bash
bunx prisma migrate reset
```

---

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   └── users/
│   │   ├── student/
│   │   │   ├── feed/
│   │   │   ├── bookmarks/
│   │   │   └── archive/
│   │   ├── notice/
│   │   │   └── [id]/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth/
│   │   │       ├── users/
│   │   │       ├── notices/
│   │   │       ├── bookmarks/
│   │   │       ├── subscriptions/
│   │   │       ├── notifications/
│   │   │       ├── upload/
│   │   │       ├── search/
│   │   │       └── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── client/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── validations/
│   │   ├── home/
│   │   └── notice/
│   │
│   ├── server/
│   │   ├── middleware/
│   │   └── modules/
│   │       ├── auth/
│   │       ├── user/
│   │       ├── notice/
│   │       ├── bookmark/
│   │       ├── subscription/
│   │       ├── dashboard/
│   │       └── upload/
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── auth-helpers.ts
│   │   ├── axios.ts
│   │   ├── cloudinary.ts
│   │   ├── firebase.ts
│   │   └── firebase-admin.ts
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   └── FcmProvider.tsx
│   │
│   └── middleware.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── generated/
│   └── prisma/
│
├── public/
│
├── next.config.ts
├── prisma.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
├── package.json
└── bun.lock
```

---

## API Overview

All endpoints are prefixed with `/api`.

<<<<<<< HEAD
| Method | Endpoint                | Access  | Description                    |
|--------|-------------------------|---------|--------------------------------|
| POST   | /api/auth/login         | Public  | Authenticate user, return JWT  |
| POST   | /api/auth/register      | Public  | Register new student account   |
| GET    | /api/notices            | Auth    | Fetch all notices (paginated)  |
| POST   | /api/notices            | Admin   | Create a new notice            |
| PATCH  | /api/notices/:id        | Admin   | Update an existing notice      |
| DELETE | /api/notices/:id        | Admin   | Delete a notice                |
| POST   | /api/notices/:id/pin    | Admin   | Pin a notice                   |
| GET    | /api/notices/pinned     | Auth    | Fetch all pinned notices       |
| POST   | /api/upload             | Admin   | Upload PDF to Cloudinary       |
| POST   | /api/notices/import     | Admin   | Bulk import notices            |
| GET    | /api/notices/export     | Admin   | Export notices as file         |
=======
| Method | Endpoint             | Access | Description                   |
| ------ | -------------------- | ------ | ----------------------------- |
| POST   | /api/auth/login      | Public | Authenticate user, return JWT |
| POST   | /api/auth/register   | Public | Register new student account  |
| GET    | /api/notices         | Auth   | Fetch all notices (paginated) |
| POST   | /api/notices         | Admin  | Create a new notice           |
| PATCH  | /api/notices/:id     | Admin  | Update an existing notice     |
| DELETE | /api/notices/:id     | Admin  | Delete a notice               |
| POST   | /api/notices/:id/pin | Admin  | Pin a notice                  |
| GET    | /api/notices/pinned  | Auth   | Fetch all pinned notices      |
| POST   | /api/upload          | Admin  | Upload PDF to Cloudinary      |
| POST   | /api/notices/import  | Admin  | Bulk import notices           |
| GET    | /api/notices/export  | Admin  | Export notices as file        |
>>>>>>> cc999e2f648e9a4eee2cf5ad8053365c7ce091b8

All mutation endpoints are protected by JWT verification middleware and rate-limited via Upstash Redis.

---

## Deployment

The application is deployed on **Vercel** with automatic deployments on push to the main branch.

**Pre-deployment checklist**

1. Set all environment variables in the Vercel dashboard under Project Settings > Environment Variables.
2. Ensure `DATABASE_URL` points to a production-grade hosted PostgreSQL instance (e.g., Supabase, Neon, Railway).
3. Run Prisma migrations against the production database before or during the first deploy:

```bash
bunx prisma migrate deploy
```

4. Confirm Cloudinary, Firebase, and Upstash credentials are for production environments, not development.

---
