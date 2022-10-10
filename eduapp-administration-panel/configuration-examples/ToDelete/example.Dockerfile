FROM node:latest

WORKDIR /eduapp-administration-panel

COPY package*.json ./

RUN npm install

COPY . .

RUN rm .env
RUN mv docker-example.env .env

RUN npm run build

EXPOSE 4221

CMD [ "node", "server/server.js" ]