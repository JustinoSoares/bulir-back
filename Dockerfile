FROM node:24-alpine

WORKDIR /

COPY package*.json ./

RUN yarn install
RUN yarn prisma generate

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "start:dev"]