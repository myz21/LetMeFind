FROM node:20-alpine

WORKDIR /app

# Load the deps
COPY package*.json ./
RUN npm install --omit=dev

# Backend code
COPY backend/ ./backend/

# Frontend code
COPY frontend/ ./frontend/
COPY index.html ./


EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "backend/src/server.js"]
