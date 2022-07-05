FROM node:latest

WORKDIR /eduapp-administration-panel

COPY package*.json ./

RUN npm install

COPY . .

ENV REACT_APP_BACKEND_ENDPOINT="http://localhost:3000/api/v1"\
	REACT_APP_EDUAPP_SYSTEM_USER_PWD="eduapp_system"\
	# EXPRESS SERVER
	EXP_HTTP_PORT=4221\
	EXP_HTTPS_PORT=8443

RUN npm run build

EXPOSE 4221

CMD [ "node", "server/server.js" ]