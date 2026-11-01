# The static build behind nginx (TECH-004). Build context: repository root.
FROM node:24-bookworm-slim AS build
RUN corepack enable
WORKDIR /repo
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@cstar/web...

FROM nginx:1.29-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/out /usr/share/nginx/html
