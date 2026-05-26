FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
WORKDIR /app
ENV CI=true
COPY . .
RUN pnpm install --frozen-lockfile
RUN NX_DAEMON=false pnpm exec nx run @breeyard/portal:build
RUN pnpm deploy --legacy --filter @breeyard/portal --prod /prod-deploy

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /prod-deploy/node_modules ./node_modules
COPY --from=builder /app/apps/portal/build ./build
COPY --from=builder /app/apps/portal/package.json ./package.json
ENV PORT=3414
ENV HOST=0.0.0.0
EXPOSE 3414
CMD ["node", "build/index.js"]
