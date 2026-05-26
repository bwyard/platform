FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN NX_DAEMON=false pnpm exec nx run @breeyard/crm:build
RUN pnpm deploy --legacy --filter @breeyard/crm --prod /prod-deploy

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /prod-deploy/node_modules ./node_modules
COPY --from=builder /app/apps/crm/build ./build
COPY --from=builder /app/apps/crm/package.json ./package.json
ENV PORT=3413
ENV HOST=0.0.0.0
EXPOSE 3413
CMD ["node", "build/index.js"]
