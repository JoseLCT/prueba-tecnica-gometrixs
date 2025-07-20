FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

COPY wait-for-it.sh ./
COPY entrypoint.sh ./
RUN chmod +x wait-for-it.sh entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
