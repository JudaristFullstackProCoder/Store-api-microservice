FROM node:17-alpine3.14
WORKDIR /store-api
ADD package.json .
ARG NODE_ENV=docker
RUN if [ "$NODE_ENV"="docker" ]; \
        then npm install --only=production; \
        else npm install; \
        fi
ADD . .
CMD ["npm", "run", "docker"]
ENV PORT 2222
EXPOSE ${PORT}