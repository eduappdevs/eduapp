# BUILD WEB 

# FROM node:alpine as eduapp-web-stage

# WORKDIR /frontend

# COPY ./frontend/package*.json ./

# RUN npm install

# COPY ./frontend .

# ENV REACT_APP_BACKEND_ENDPOINT=http://localhost:3000 \
# 	REACT_APP_WEBSOCKET_ENDPOINT=ws://$REACT_APP_BACKEND_DOMAIN/chat \
# 	REACT_APP_PORT=3001 \
# 	REACT_APP_DOMAIN=localhost \
# 	REACT_APP_BACKEND_DOMAIN=localhost:3000\
# 	# REACT_APP_BACKEND_DOMAIN=localhost:8000/api\
# 	REACT_APP_FRONTEND_DOMAIN=localhost:8000\
# 	REACT_APP_ENCRYPTION_PATTERN="#_::_#"\
# 	REACT_APP_BASENAME="/app" \
# 	# FRONTEND ENDPOINT
# 	REACT_APP_SUPPORT_ENDPOINT=http://localhost:3003\
# 	# FIREBASE
# 	REACT_APP_FB_API_KEY=AIzaSyAfeQYCIWSjxMluOfGWNvLXOYOinUEFMFA\
# 	REACT_APP_FB_AUTH_DOMAIN=eduapp-online.firebaseapp.com\
# 	REACT_APP_FB_PROJECT_ID=eduapp-online\
# 	REACT_APP_FB_STORAGE_BUCKET=eduapp-online.appspot.com\
# 	REACT_APP_FB_SENDER_ID=414829647907\
# 	REACT_APP_FB_ID="1:414829647907:web:853b6c6101317d4a5ab996" 


# RUN npm run build

# # BUILD WEB-ADMIN

# FROM node:alpine as eduapp-admin-stage

# WORKDIR /eduapp-administration-panel

# COPY ./eduapp-administration-panel/package*.json ./

# RUN npm install

# COPY ./eduapp-administration-panel .

# ENV REACT_APP_BASENAME="/admin" \
# 	REACT_APP_BACKEND_ENDPOINT=http://localhost:8000/api

# RUN npm run build

# BUILD NGINX

FROM nginx:alpine as nginx-server

# COPY --from=eduapp-web-stage /frontend/build /usr/share/nginx/html/eduapp/app
# COPY --from=eduapp-admin-stage /eduapp-administration-panel/build /usr/share/nginx/html/eduapp/admin

# COPY ./server-config/nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY ./server-config/configs/* /etc/nginx/conf.d

# COPY ./server-config/eduapp-404.html /usr/share/nginx/html/eduapp/eduapp-404.html
# COPY ./server-config/eduapp.html /usr/share/nginx/html/eduapp/eduapp.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]