FROM node:latest

WORKDIR /eduapp-administration-panel

COPY package*.json ./

RUN npm install

COPY . .

# RUN rm .env
# RUN mv docker.env .env

RUN npm run build

# Change to administration-panel port
EXPOSE 4010 

CMD [ "node", "server/server.js" ]