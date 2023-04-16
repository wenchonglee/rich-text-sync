FROM node:18-alpine as fe-build

COPY . .
RUN npm i -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM nginx:1.24-alpine
COPY --from=fe-build ./dist /usr/share/nginx/html