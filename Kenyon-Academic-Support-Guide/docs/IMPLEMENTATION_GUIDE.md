
# Implementation Guide

This guide mirrors the technical design you approved and maps it to the scaffold in this repository.

## Contents
1. Architecture overview
2. Database schema
3. REST API surface
4. Frontend structure & UX
5. Data integration approach
6. Security/FERPA notes
7. Roadmap & testing

## 1) Architecture

```
React (Next.js)  <—HTTPS—>  Express API (Node/TS)
                                |
                           Prisma ORM
                                |
                           PostgreSQL
                         + Redis (cache)
                                |
                     ETL Jobs: Banner / Alumni / Orgs
```

- Stateless API, horizontal scale-ready.
- Prisma for schema + migrations.
- OpenTelemetry hooks ready (see `backend/src/observability` placeholder).

## 2) Database Schema (Prisma)

See `backend/prisma/schema.prisma`. It includes:
- `users`, `student_profiles` with minimal PII
- `career_options`, `interest_*_map`
- `courses`, `course_prereqs`, `course_offerings`
- `alumni`, `alumni_positions` with consent/privacy flags
- `organizations`
- `favorites`, `explanations`

## 3) REST API

Mounted under `/api/v1`:
- `POST /interests` — save student's interest
- `GET  /interests/options` — autosuggest
- `GET  /recommendations/courses` — course recs + prereq status
- `GET  /recommendations/organizations` — org suggestions
- `GET  /alumni/search` — alumni list with filters
- `GET  /explanations/:id` — explanation stub

See route files in `backend/src/routes/*`.

## 4) Frontend

- Next.js App Router with `src/app`.
- Components for career interest input and recommendations summary.
- API helper in `src/lib/api.ts`.
- Tailwind included (minimal config).

## 5) Data Integration

- Add Banner connector code under `backend/src/integrations/banner/*`.
- Alumni import pipeline under `backend/src/integrations/alumni/*`.
- Orgs import under `backend/src/integrations/orgs/*`.
- Jobs runner using BullMQ or Temporal (not included by default).

## 6) Security / FERPA

- Add Row-Level Security (RLS) policies when deploying to managed Postgres.
- Keep consent checks in alumni routes before exposing contact info.
- Do not log PII; use structured logs with redaction.

## 7) Roadmap & Tests

- See `docs/ROADMAP.md` and `docs/TESTING.md`.
