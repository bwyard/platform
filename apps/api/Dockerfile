FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
WORKDIR /app
ENV CI=true
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter './packages/**' build
RUN pnpm --filter @breeyard/api build
RUN pnpm deploy --legacy --filter @breeyard/api --prod /prod-deploy

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /prod-deploy/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/packages/core/database/migrations ./migrations
COPY --from=builder /app/apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENV PORT=3400
ENV HOST=0.0.0.0
EXPOSE 3400
CMD ["./entrypoint.sh"]
