FROM node:20-alpine as common

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM common as runtime

RUN chmod +x ./dist/run.js

ENTRYPOINT ["./dist/run.js"]