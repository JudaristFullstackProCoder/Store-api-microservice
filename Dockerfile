FROM mongo
WORKDIR /web
ADD ./package.json ./
RUN npm install
ADD . ./
EXPOSE 2222/tcp