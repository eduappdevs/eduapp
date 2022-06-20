FROM node:latest

WORKDIR /eduapp-administration-panel

COPY package*.json ./

RUN npm install

COPY . .

# ENV REACT_APP_BACKEND_ENDPOINT=http://localhost:3000 \
# 	REACT_APP_REPORTS_ENDPOINT=http://localhost:5488

EXPOSE 3002

CMD [ "npm", "run", "dev" ]