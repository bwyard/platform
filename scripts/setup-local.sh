#!/usr/bin/env bash
# ============================================================
# bwyard/platform — local dev bootstrap
# Run once after cloning: bash scripts/setup-local.sh
# ============================================================

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "==> Checking prerequisites..."
command -v docker >/dev/null 2>&1 || { echo "ERROR: docker not found"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "ERROR: pnpm not found"; exit 1; }

echo "==> Copying .env.example files..."

# Root (API)
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "    created .env (root/api)"
else
  echo "    .env already exists (skipped)"
fi

# Per-app SvelteKit envs
for app in portal crm cms web; do
  if [ ! -f "apps/$app/.env" ]; then
    cp "apps/$app/.env.example" "apps/$app/.env"
    echo "    created apps/$app/.env"
  else
    echo "    apps/$app/.env already exists (skipped)"
  fi
done

echo "==> Starting Docker services..."
POSTGRES_PASSWORD=changeme REDIS_PASSWORD=changeme \
  docker compose -f infra/docker/docker-compose.yml --profile breeyard up -d

echo "==> Waiting for Postgres to be healthy..."
for i in $(seq 1 30); do
  if docker exec breeyard-postgres pg_isready -U breeyard >/dev/null 2>&1; then
    echo "    Postgres ready."
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "ERROR: Postgres did not become healthy in time"
    exit 1
  fi
  sleep 1
done

echo "==> Installing dependencies..."
pnpm install

echo ""
echo "==> Done. Services:"
echo "    Postgres  localhost:5433  (user: breeyard / pass: changeme / db: breeyard)"
echo "    Redis     localhost:6380"
echo "    Mailpit   http://localhost:8026"
echo ""
echo "==> Next: run migrations, then start apps"
echo "    pnpm --filter @breeyard/api exec drizzle-kit migrate"
echo "    pnpm --filter @breeyard/api dev      # API on :3010"
echo "    pnpm --filter @breeyard/portal dev   # portal on :3014"
