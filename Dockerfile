# ─────────────────────────────────────────────────────────────
# Stage 1: Build React frontend
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .

# Build with the API URL pointing to the same domain (nginx proxies /api → node)
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: Build backend dependencies
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS backend-build

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .

# ─────────────────────────────────────────────────────────────
# Stage 3: Combined runtime image
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Create directories
RUN mkdir -p /usr/share/nginx/html /var/log/supervisor /var/log/nginx /run/nginx

# Copy backend
COPY --from=backend-build /app/backend /app/backend

# Copy built React app to nginx html root
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html

# Copy configs
COPY nginx-combined.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Backend runs on 3001 internally; nginx listens on 5000 externally
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 5000

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
