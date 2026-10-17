# CarryMate backend — deploy with Docker

## Build the image

```bash
cd backend
docker build -t carrymate-backend .
```

## Run it

```bash
# One-time: create a secret for signing login tokens
export JWT_SECRET=$(openssl rand -hex 32)

docker run -d --name carrymate-backend \
  -p 8080:8080 \
  -e AUTH_JWT_SECRET="$JWT_SECRET" \
  -e APP_CORS_ALLOWED_ORIGINS="https://dpreddysathi.github.io" \
  -v carrymate-data:/app/data \
  --restart unless-stopped \
  carrymate-backend
```

Notes:

- The H2 database file lives at `/app/data/carrymate.mv.db` inside the
  container; the `-v carrymate-data:/app/data` mount keeps it across
  restarts and image rebuilds. Back it up with
  `docker run --rm -v carrymate-data:/data -v "$PWD":/backup alpine tar czf /backup/carrymate-data.tgz -C /data .`
- Demo seed data is on by default (`app.demo-seed=true`). For a clean
  production database add `-e APP_DEMO_SEED=false` (property
  `app.demo-seed`).
- The frontend must point at this backend: build it with
  `VITE_API_URL=https://<your-backend-public-url>`.
- Never commit `AUTH_JWT_SECRET` to git. Rotate it by re-creating the
  container with a new value (all users will need to log in again).
