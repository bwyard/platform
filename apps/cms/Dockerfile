FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN NX_DAEMON=false pnpm exec nx run @breeyard/cms:build
RUN pnpm deploy --legacy --filter @breeyard/cms --prod /prod-deploy

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /prod-deploy/node_modules ./node_modules
COPY --from=builder /app/apps/cms/build ./build
COPY --from=builder /app/apps/cms/package.json ./package.json
ENV PORT=3412
ENV HOST=0.0.0.0
EXPOSE 3412
CMD ["node", "build/index.js"]
