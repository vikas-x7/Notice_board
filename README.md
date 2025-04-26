# Smart Notice Board

A full-stack notice management system for colleges to create, manage, and deliver announcements efficiently with role-based access.

---

## Features

**Admin**

- Create, edit, delete notices
- Pin priority notices
- Upload PDFs (Cloudinary)
- Bulk import/export
- Search & filter notices

**Student**

- Personalized notice feed
- View pinned & recent notices
- Search by category/date

**System**

- JWT authentication + role-based access
- Rate limiting (Upstash Redis)
- SSR for fast performance

---

## Tech Stack

- Frontend: Next.js, Tailwind CSS
- Backend: Next.js API Routes, Node.js
- DB: PostgreSQL + Prisma
- Auth: JWT, bcrypt
- State: Zustand, React Query
- Services: Cloudinary, Firebase, Upstash Redis

---

## Getting Started

```bash
git clone https://github.com/your-username/hack-a-sprint.git
cd hack-a-sprint
bun install
bun run dev
```

---

## Environment Variables

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

## API (Core)

- POST /api/auth/login
- POST /api/auth/register
- GET /api/notices
- POST /api/notices (Admin)
- PATCH /api/notices/:id
- DELETE /api/notices/:id

---

## Deployment

- Hosted on Vercel
- Set env vars
- Run: `prisma migrate deploy`

---

## Summary

A scalable, production-ready notice system with clean architecture, role-based access, and optimized performance.
