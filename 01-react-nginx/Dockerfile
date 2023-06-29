# SPA 소스를 빌드

ARG NODE_IMG_VERSION=lts-slim
ARG NGINX_IMG_VERSION=stable-alpine3.17-slim

# 
FROM node:${NODE_IMG_VERSION} AS BUILD
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install 
RUN npm run build

FROM nginx:${NGINX_IMG_VERSION}
COPY --from=BUILD /usr/src/app/dist /usr/share/nginx/html

# remove default nginx conf
RUN rm /etc/nginx/conf.d/default.conf

# remove usr/src
RUN rm -rf /usr/src
# 설정 집어넣기
COPY ./nginx.conf /etc/nginx/conf.d

# EXPOSE 3000
# CMD ["npm","run","build"]