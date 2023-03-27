# Build static files from frontend directory
FROM node:18-alpine as fe-build

COPY . /app
WORKDIR /app/frontend

RUN npm i -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Copy static files to backend, retrieve dependencies, and start the server
FROM denoland/deno
COPY . /app
COPY --from=fe-build /app/frontend/dist /app/backend/dist

WORKDIR /app/backend

RUN deno cache main.ts
CMD ["task", "dev"]