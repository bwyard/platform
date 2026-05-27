FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
WORKDIR /app
ENV CI=true
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @breeyard/web run build
RUN pnpm deploy --legacy --filter @breeyard/web --prod /prod-deploy

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /prod-deploy/node_modules ./node_modules
COPY --from=builder /app/apps/web/build ./build
COPY --from=builder /app/apps/web/package.json ./package.json
ENV PORT=3411
ENV HOST=0.0.0.0
EXPOSE 3411
CMD ["node", "build/index.js"]
