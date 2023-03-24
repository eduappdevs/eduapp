FROM node:alpine as builder

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN rm .env
RUN mv docker-example.env .env

RUN npm run build

EXPOSE 4220

CMD [ "node", "server/server.js" ]