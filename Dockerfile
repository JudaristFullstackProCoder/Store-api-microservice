FROM mongo
WORKDIR /web
ADD ./package.json ./
RUN npm install
ADD . ./
CMD ["nodemon", "./server/server.js"]
EXPOSE 2222/tcp

FROM node:16.13.5
WORKDIR /web
ADD ./package.json ./
RUN npm install
ADD . ./
CMD ["nodemon", "./server/server.js"]
EXPOSE 2222/tcp
