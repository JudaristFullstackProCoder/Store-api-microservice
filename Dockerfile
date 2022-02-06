FROM mongo
WORKDIR /store-api
ADD package.json .
RUN npm install
ADD . .
CMD node ./server/server.js
EXPOSE 2222/tcp

FROM node:16-alpine3.14
WORKDIR /store-api
ADD package.json .
RUN npm install
ADD . .
CMD node ./server/server.js
EXPOSE 2222/tcp
