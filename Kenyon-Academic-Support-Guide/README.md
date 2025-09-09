
# Kenyon Academic Support Guide — Career Guidance Web App (Starter)

This folder contains a Git-ready implementation scaffold for the **Career Guidance** application described in your spec.

- **Frontend:** Next.js (React) + Tailwind + React Query
- **Backend:** Node.js (Express + TypeScript) + Prisma
- **DB:** PostgreSQL (Docker), seeds included
- **Cache/Jobs:** Redis (optional, docker-compose provided)
- **CI:** GitHub Actions for lint, build, typecheck
- **Security:** CORS, Helmet, basic rate-limiting (stub), env templates
- **Compliance:** scaffolds for FERPA-friendly separation and consent flags

> Generated on 2025-09-09. See `docs/IMPLEMENTATION_GUIDE.md` for full architecture & API details.

## Quick Start (Local)

```bash
# 1) Start DB and Redis
docker compose up -d db redis

# 2) Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# 3) Frontend
cd ../frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:4000/api/v1

## Push as a Pull Request

Use the included script to create a branch and open a PR against your repo:

```bash
bash scripts/push_pr.sh
```

This will create branch `feat/career-guidance-starter` and push all files to `Wiz1702/Kenyon-Academic-Support-Guide` (origin must be set to your fork/clone of that repo).
