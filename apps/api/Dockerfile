FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN NX_DAEMON=false pnpm exec nx run-many -t build --projects=@breeyard/database,@breeyard/auth,@breeyard/shared,@breeyard/config,@breeyard/logging,@breeyard/errors,@breeyard/validation
RUN NX_DAEMON=false pnpm exec nx run @breeyard/api:build
RUN pnpm deploy --legacy --filter @breeyard/api --prod /prod-deploy

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /prod-deploy/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
ENV PORT=3400
ENV HOST=0.0.0.0
EXPOSE 3400
CMD ["node", "dist/main.js"]
