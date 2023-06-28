# SPA 소스를 빌드

ARG IMG_VERSION=lts-slim

FROM node:${IMG_VERSION} AS BUILD
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install 
EXPOSE 3000
CMD ["npm","run","build"]