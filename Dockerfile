# Multi-stage build — FastAPI backend + React frontend
FROM python:3.12-slim AS backend

WORKDIR /app/server
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ .

# Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm ci
COPY client/ .
RUN npm run build

# Production
FROM python:3.12-slim
WORKDIR /app
COPY --from=backend /app/server ./server
COPY --from=backend /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=frontend /app/client/dist ./server/public

EXPOSE 3001
CMD ["python", "server/main.py"]
