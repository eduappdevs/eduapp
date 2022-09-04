FROM node:latest

WORKDIR /eduapp-administration-panel

COPY package*.json ./

RUN npm install

COPY . .

# RUN rm .env
# RUN mv docker.env .env

RUN npm run build

EXPOSE 4010

CMD [ "node", "server/server.js" ]