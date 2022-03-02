FROM node:16-alpine3.14
WORKDIR /store-api
# add nodemon globaly
RUN npm install -g nodemon
ADD package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV"="production" ]; \
        then npm install --only=production; \
        else npm install; \
        fi

ADD . .
CMD ["npm", "run", "dev"]
ENV PORT 2222
EXPOSE ${PORT}