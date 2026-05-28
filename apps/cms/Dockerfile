FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
WORKDIR /app
ENV CI=true
ARG PUBLIC_API_URL=http://localhost:3400
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @breeyard/cms run build
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
