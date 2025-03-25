FROM node:20.12.2-buster AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build


FROM node:20.12.2-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

EXPOSE 3000

CMD ["npm", "start"]