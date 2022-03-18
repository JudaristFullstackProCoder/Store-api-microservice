FROM node:17-alpine3.14
WORKDIR /store-api
ADD package.json .
ARG NODE_ENV=docker-dev
RUN if [ "$NODE_ENV"="docker-dev" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
ADD . .
RUN if [ "$NODE_ENV"="docker-dev" ]; \
        then npm run docker-dev; \
        else npm run docker; \
        fi
ENV PORT 2223