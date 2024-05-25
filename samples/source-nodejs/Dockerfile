FROM node:20-alpine as common

WORKDIR /usr/src/app

COPY source-nodejs/package.json source-nodejs/package-lock.json ./

RUN npm ci

COPY source-nodejs .

RUN npm run build

FROM common as runtime

RUN chmod +x ./dist/run.js

ENTRYPOINT ["./dist/run.js"]