FROM node:20-alpine
WORKDIR /app
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --prefix backend --production
COPY backend ./backend
WORKDIR /app/backend
ENV PORT 4000
EXPOSE 4000
CMD ["node", "src/server.js"]
