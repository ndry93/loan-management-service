FROM node:21.7.3-alpine

WORKDIR /app

EXPOSE 3000

CMD npm run start:dev
