ARG NODE_IMAGE_VER=lts-slim
ARG NGNIX_IMAGE_VER=stable-alpine3.17-slim

FROM node:${NODE_IMAGE_VER} AS builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY ./web .
RUN yarn install
RUN yarn run build

FROM nginx:${NGNIX_IMAGE_VER}
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# remove default nginx conf
RUN rm /etc/nginx/conf.d/default.conf

# remove usr/src
RUN rm -rf /usr/src
# 설정 집어넣기
COPY ./nginx.conf /etc/nginx/conf.d
