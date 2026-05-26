# Sealos Next.js PostgreSQL proof app

This is a minimal Sealos content proof app for validating a containerized Next.js service with PostgreSQL. This directory is meant to be pushed as its own standalone GitHub repository; the included GitHub Actions workflow uses repository-root paths.

It does not include real credentials. Set `DATABASE_URL` at runtime.

## What it proves

- Next.js listens on port `3000` and is suitable for container deployment.
- The app accepts `DATABASE_URL` for PostgreSQL.
- Container startup runs `scripts/setup-db.mjs` and creates `proof_events` if needed.
- `GET /api/proof` reads recent records from PostgreSQL.
- `POST /api/proof` writes a record and returns it.

## Environment

```bash
DATABASE_URL="postgresql://<db_user>:<db_password>@<db_host>:5432/<db_name>"
```

## Local development

```bash
npm install
npm run db:setup
npm run dev
```

The app runs at <http://localhost:3000>.

## Verify read/write proof

```bash
curl http://localhost:3000/api/proof

curl -X POST http://localhost:3000/api/proof   -H 'content-type: application/json'   -d '{"label":"sealos proof write"}'
```

Expected behavior:

- `GET /api/proof` returns `{ "ok": true, "events": [...] }`.
- `POST /api/proof` returns `{ "ok": true, "event": { ... } }` with the inserted row.
- The homepage shows PostgreSQL connection status and recent `proof_events`.

## Container image workflow

`.github/workflows/docker.yml` builds and pushes:

- `ghcr.io/${{ github.repository_owner }}/sealos-nextjs-postgres-proof:latest`
- `ghcr.io/${{ github.repository_owner }}/sealos-nextjs-postgres-proof:${{ github.sha }}`

The workflow is triggered by `push` and `workflow_dispatch`. It expects this proof app to be the repository root, so its Docker build context is `.`.
