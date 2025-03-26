FROM node:22.14.0-bullseye as builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build


FROM node:22.14.0-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

EXPOSE 3000

CMD ["npm", "start"]